import {Table, Schema} from 'tableschema'
import {HotRegister} from '@/hot.js'
import store from '@/store/modules/hots.js'
import tabStore from '@/store/modules/tabs.js'
import {includeHeadersInData, hasAllColumnNames} from '@/frictionlessUtilities.js'
import {allTablesAllColumnsFromSchema$} from '@/rxSubject.js'

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

function checkRow(rowNumber, row, schema, tableRows, errorCollector) {
  // if row contains foreign relation objects cast the original
  try {
    schema.castRow(row)
  } catch (err) {
    errorHandler(err, rowNumber, errorCollector)
  }
}

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
    let foreignHotId = getHotIdFromForeignKeyForeignTable(foreignKey.reference.resource, localHotId)
    // foreign keys must also have column properties set
    if (!hasColumnProperties(foreignHotId, callback)) {
      relations = false
      break
    }
    let data = getForeignKeyData(foreignHotId)
    let schema = await buildSchema(data, foreignHotId)
    let table = await createFrictionlessTable(data, schema)
    let rows = await table.read({keyed: true})
    relations[foreignKey.reference.resource] = rows
  }
  return relations
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

function checkHeaderErrors(headers, errorCollector, hasColHeaders) {
  // TODO: consider better way to accommodate or remove - need headers/column names so this logic may be redundant
  let rowNumber = hasColHeaders
    ? 0
    : 1
  if (isRowBlank(headers)) {
    errorCollector.push({rowNumber: rowNumber, message: `Headers are completely blank`, name: 'Blank Row'})
  } else {
    let diff = blankCellCount(headers)
    if (diff > 0) {
      errorCollector.push({rowNumber: rowNumber, message: `There are ${diff} blank header(s)`, name: 'Blank Header'})
    }
    let diff2 = duplicatesCount(headers)
    if (diff2 > 0) {
      errorCollector.push({rowNumber: rowNumber, message: `There are ${diff2} duplicate header(s)`, name: 'Duplicate Header'})
    }
  }
}

export async function validateActiveDataAgainstSchema(callback) {
  let hot = HotRegister.getActiveInstance()
  let hotId = hot.guid
  if (!hasColumnProperties(hotId, callback)) {
    return
  }
  const data = includeHeadersInData(hot)
  const errorCollector = []
  const hasColHeaders = hot.hasColHeaders()
  // ensure headers not lost from data
  const headers = data[0]
  checkHeaderErrors(headers, errorCollector, hasColHeaders)
  let schema = await buildSchema(data, hotId)
  let table = await createFrictionlessTable(data, schema)
  // wait for frictionless pr#124 and uncomment
  let relations = false
  try {
    relations = await collateForeignKeys(hotId, callback)
  } catch (error) {
    errorCollector.push({rowNumber: 0,
      message: `There was a problem validating 1 or more foreign tables. Validate foreign tables first.`,
      name: 'Invalid foreign table(s)'
    })
  }
  const stream = await table.iter({keyed: false, extended: true, stream: true, cast: false, forceCast: true, relations: relations})
  stream.on('data', (row) => {
    // TODO: consider better way to accommodate or remove - need headers/column names so this logic may be redundant
    let rowNumber = hasColHeaders
      ? row[0]
      : row[0] + 1
    if (row[2] instanceof Error) {
      let err = row[2]
      errorHandler(err, rowNumber, errorCollector)
    } else {
      if (isRowBlank(row[2])) {
        errorCollector.push({rowNumber: rowNumber, message: `Row ${rowNumber} is completely blank`, name: 'Blank Row'})
      }
      // TODO: once frictionless release allows forceCast remove this call & the corresponding method
    // checkRow(rowNumber, row[2], table.schema, errorCollector)
    }
  })
  stream.on('error', (error) => {
    console.log(error)
    const rowNumber = error.rowNumber ? error.rowNumber : 'N/A'
    errorHandler(error, rowNumber, errorCollector)
    // ensure error sent back
    stream.end()
  })
  stream.on('end', () => {
    callback(errorCollector)
  })
}

function hasColumnProperties(hotId, callb) {
  let columnProperties = store.state.hotTabs[hotId].columnProperties
  if (!columnProperties || columnProperties.length === 0) {
    callb([
      {
        rowNumber: 0,
        message: `Column properties, including the column properties of any foreign keys, must be set.`,
        name: 'No Column Properties'
      }
    ])
    return false
  }
  if (!hasAllColumnNames(hotId, columnProperties)) {
    callb([
      {
        rowNumber: 0,
        message: `Every Column property, including the column properties of any foreign keys, must have a 'name'.`,
        name: 'Missing Column Property names'
      }
    ])
    return false
  }
  return true
}

function errorHandler(err, rowNumber, errorCollector) {
  if (err.multiple) {
    for (const error of err.errors) {
      let columnNumber = error.columnNumber || 'N/A'
      errorCollector.push({columnNumber: columnNumber, rowNumber: rowNumber, message: error.message, name: error.name})
    }
  } else {
    let columnNumber = err.columnNumber || 'N/A'
    errorCollector.push({columnNumber: columnNumber, rowNumber: rowNumber, message: err.message, name: err.name})
  }
}
