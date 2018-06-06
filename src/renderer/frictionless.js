import {Table, Schema} from 'tableschema'
import {HotRegister} from '@/hot.js'
import store from '@/store/modules/hots.js'
import tabStore from '@/store/modules/tabs.js'
import {includeHeadersInData, hasAllColumnNames, getValidNames} from '@/frictionlessUtilities.js'
import {allTablesAllColumnsFromSchema$, errorFeedback$} from '@/rxSubject.js'
import {ipcRenderer as ipc} from 'electron'
import {Package} from 'datapackage'

async function inferSchema(data) {
  const schema = await Schema.load({})
  // workaround for schema.infer stripping headers
  let dataClone = [...data]
  let headers = dataClone.shift()
  // frictionless default for csv dialect is that tables DO have headers
  // await schema.infer(data, {headers: 0})
  await schema.infer(dataClone, {headers: headers})
  return schema
}

function storeData(hotId, schema) {
  return store.mutations.pushTableSchema(store.state, {
    hotId: hotId,
    schema: schema
  })
}

export async function guessColumnProperties() {
  let hot = HotRegister.getActiveInstance()
  let id = hot.guid
  let columnProperties = store.state.hotTabs[id].columnProperties
  if (!columnProperties) {
    return 'Failed: Guess column properties failed. Column properties must be set.'
  }
  let names = getValidNames(id)
  if (_.isEmpty(names)) {
    return 'Failed: Guess column properties failed. Column property names must be set.'
  }
  if (!hasAllColumnNames(id, columnProperties, names)) {
    return 'Failed: Guess column properties failed. All Column property names must be set and must be unique.'
  }
  let data = includeHeadersInData(hot)
  // let activeHot = HotRegister.getActiveHotIdData()
  let schema = await inferSchema(data)
  let isStored = storeData(id, schema)
  allTablesAllColumnsFromSchema$.next(store.getters.getAllHotTablesColumnProperties(store.state, store.getters)())
  let message = isStored
    ? 'Success: Guess column properties succeeded.'
    : 'Failed: Guess column properties failed.'
  return message
}

// function checkRow(rowNumber, row, schema, tableRows, errorCollector) {
//   // if row contains foreign relation objects cast the original
//   try {
//     schema.castRow(row)
//   } catch (err) {
//     errorHandler(err, rowNumber, errorCollector)
//   }
// }

// function checkRow(rowNumber, row, schema, tableRows) {
//   // if row contains foreign relation objects cast the original
//   try {
//     schema.castRow(row)
//   } catch (err) {
//     errorHandler(err, rowNumber)
//   }
// }

async function buildSchema(data, hotId) {
  let schema = await inferSchema(data)
  let hotTab = store.state.hotTabs[hotId]
  schema.descriptor.fields = hotTab.columnProperties
  schema.descriptor.primaryKey = hotTab.tableProperties.primaryKeys
  schema.descriptor.foreignKeys = hotTab.tableProperties.foreignKeys
  store.mutations.initMissingValues(store.state, hotTab)
  schema.descriptor.missingValues = hotTab.tableProperties.missingValues
  return schema
}

async function createFrictionlessTable(data, schema) {
  // provide schema rather than infer
  // frictionless default for csv dialect is that tables DO have headers
  let dataClone = [...data]
  let headers = dataClone.shift()
  let table = await Table.load(dataClone, {
    schema: schema,
    headers: headers
  })
  table.schema.commit()
  return table
}

async function collateForeignKeys(localHotId, callback) {
  const foreignKeys = store.state.hotTabs[localHotId].tableProperties.foreignKeys
  if (typeof foreignKeys === 'undefined') {
    return false
  }
  let relations = {}
  for (const foreignKey of foreignKeys) {
    let rows
    if (foreignKey.reference.package) {
      rows = await collatePackageForeignKeys(foreignKey)
    } else {
      let foreignHotId = getHotIdFromForeignKeyForeignTable(foreignKey.reference.resource, localHotId)
      // foreign keys must also have column properties set
      if (!hasColumnProperties(foreignHotId, callback)) {
        relations = false
        break
      }
      let data = getForeignKeyData(foreignHotId)
      let schema = await buildSchema(data, foreignHotId)
      let table = await createFrictionlessTable(data, schema)
      rows = await table.read({keyed: true})
    }
    relations[foreignKey.reference.resource] = rows
  }
  return relations
}

async function collatePackageForeignKeys(foreignKey) {
  try {
    let rows = await ipc.sendSync('loadPackageUrlResourcesAsFkRelations', foreignKey.reference.package, foreignKey.reference.resource)
    return rows
  } catch (error) {
    console.error('There was an error in creating package foreign keys', error)
  }
}

function getForeignKeyData(foreignHotId) {
  let hot = HotRegister.getInstance(foreignHotId)
  return includeHeadersInData(hot)
}

function getHotIdFromForeignKeyForeignTable(title, hotId) {
  // check for fk in same table
  if (title === '') {
    return hotId
  }
  let tabId = tabStore.getters.findTabIdFromTitle(tabStore.state, tabStore.getters)(title)
  return store.getters.getSyncHotIdFromTabId(store.state, store.getters)(tabId)
}

function isRowBlank(row) {
  return row.filter(Boolean).length === 0
}

function blankCellCount(row) {
  let sanitised = row.filter(Boolean)
  return row.length - sanitised.length
}

function duplicatesCount(row) {
  let uniques = new Set(row)
  return row.length - uniques.size
}

// function checkHeaderErrors(headers, errorCollector) {
//   // TODO: consider better way to accommodate or remove - need headers/column names so this logic may be redundant
//   if (isRowBlank(headers)) {
//     // errorCollector.push({message: `Headers are completely blank`, name: 'Blank Row'})
//     errorHandler({message: `Headers are completely blank`, name: 'Blank Row'}, null, errorCollector)
//   } else {
//     let diff = blankCellCount(headers)
//     if (diff > 0) {
//       // errorCollector.push({message: `There are ${diff} blank header(s)`, name: 'Blank Header'})
//       errorHandler({message: `There are ${diff} blank header(s)`, name: 'Blank Header'}, null, errorCollector)
//     }
//     let diff2 = duplicatesCount(headers)
//     if (diff2 > 0) {
//       // errorCollector.push({message: `There are ${diff2} duplicate header(s)`, name: 'Duplicate Header'})
//       errorHandler({message: `There are ${diff2} duplicate header(s)`, name: 'Duplicate Header'}, null, errorCollector)
//     }
//   }
// }
function checkHeaderErrors(headers) {
  // TODO: consider better way to accommodate or remove - need headers/column names so this logic may be redundant
  if (isRowBlank(headers)) {
    // errorCollector.push({message: `Headers are completely blank`, name: 'Blank Row'})
    errorHandler({message: `Headers are completely blank`, name: 'Blank Row'})
  } else {
    let diff = blankCellCount(headers)
    if (diff > 0) {
      // errorCollector.push({message: `There are ${diff} blank header(s)`, name: 'Blank Header'})
      errorHandler({message: `There are ${diff} blank header(s)`, name: 'Blank Header'})
    }
    let diff2 = duplicatesCount(headers)
    if (diff2 > 0) {
      // errorCollector.push({message: `There are ${diff2} duplicate header(s)`, name: 'Duplicate Header'})
      errorHandler({message: `There are ${diff2} duplicate header(s)`, name: 'Duplicate Header'})
    }
  }
}

export async function validateActiveDataAgainstSchema(callback) {
  // console.time('initValidation')
  let hot = HotRegister.getActiveInstance()
  let hotId = hot.guid
  if (!hasColumnProperties(hotId, callback)) {
    return
  }
  const data = includeHeadersInData(hot)
  // const errorCollector = []
  // ensure headers not lost from data
  const headers = data[0]
  // checkHeaderErrors(headers, errorCollector)
  checkHeaderErrors(headers)
  let schema = await buildSchema(data, hotId)
  let table = await createFrictionlessTable(data, schema)
  // wait for frictionless pr#124 and uncomment
  let relations = false
  try {
    relations = await collateForeignKeys(hotId, callback)
    // console.log('have relations', relations)
  } catch (error) {
    console.error(error)
    errorHandler({message: `There was a problem validating 1 or more foreign tables. Validate foreign tables first.`, name: 'Invalid foreign table(s)'})
    // errorHandler({message: `There was a problem validating 1 or more foreign tables. Validate foreign tables first.`, name: 'Invalid foreign table(s)'}, null, errorCollector)
    // errorCollector.push({message: `There was a problem validating 1 or more foreign tables. Validate foreign tables first.`, name: 'Invalid foreign table(s)'})
  }
  // console.log('creating table iterator')
  const stream = await table.iter({
    keyed: false,
    extended: true,
    stream: true,
    cast: true,
    forceCast: true,
    relations: relations
  })
  // console.timeEnd('initValidation')
  // console.log('streaming...')
  console.timeEnd('getError')
  stream.on('data', (row) => {
    // console.log(`next row`, row)
    if (row instanceof Error) {
      // errorHandler(row, row.rowNumber, errorCollector)
      errorHandler(row, row.rowNumber)
    } else {
      if (isRowBlank(row[2])) {
        errorHandler({message: `Row ${row[0]} is completely blank`, name: 'Blank Row'}, row[0])
        // errorHandler({message: `Row ${row[0]} is completely blank`, name: 'Blank Row'}, row[0], errorCollector)
        // errorCollector.push({rowNumber: row[0], message: `Row ${row[0]} is completely blank`, name: 'Blank Row'})
      }
    }
  })
  stream.on('error', (error) => {
    // console.error(error)
    errorHandler(error, error.rowNumber)
    // errorHandler(error, error.rowNumber, errorCollector)
    // ensure error sent back
    stream.end()
  })
  stream.on('end', () => {
    // console.log('stream ended')
    // callback(errorCollector)
    callback()
  })
}

function hasColumnProperties(hotId, callb) {
  let columnProperties = store.state.hotTabs[hotId].columnProperties
  if (!columnProperties || columnProperties.length === 0) {
    callb([
      {
        message: `Column properties, including the column properties of any foreign keys, must be set.`,
        name: 'No Column Properties'
      }
    ])
    return false
  }
  let names = getValidNames(hotId)
  if (!hasAllColumnNames(hotId, columnProperties, names)) {
    callb([
      {
        message: `Every Column property, including the column properties of any foreign keys, must have a unique 'name'.`,
        name: 'Missing Column Property names'
      }
    ])
    return false
  }
  return true
}

function errorHandler(err, rowNumber) {
  if (err.multiple) {
    for (const error of err.errors) {
      errorFeedback$.next({
      // errorCollector.push({
        columnNumber: error.columnNumber,
        rowNumber: error.rowNumber || rowNumber,
        message: error.message,
        name: error.name
      })
    }
  } else {
    errorFeedback$.next({
    // errorCollector.push({
      columnNumber: err.columnNumber,
      rowNumber: rowNumber,
      message: err.message,
      name: err.name
    })
  }
}

// function errorHandler(err, rowNumber, errorCollector) {
//   if (err.multiple) {
//     for (const error of err.errors) {
//       errorFeedback$.next({
//       // errorCollector.push({
//         columnNumber: error.columnNumber,
//         rowNumber: error.rowNumber || rowNumber,
//         message: error.message,
//         name: error.name
//       })
//     }
//   } else {
//     errorFeedback$.next({
//     // errorCollector.push({
//       columnNumber: err.columnNumber,
//       rowNumber: rowNumber,
//       message: err.message,
//       name: err.name
//     })
//   }
// }
