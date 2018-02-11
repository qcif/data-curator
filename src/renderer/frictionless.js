import {Table, Schema} from 'tableschema'
import {HotRegister} from '@/hot.js'
import store from '@/store/modules/hots.js'
import tabStore from '@/store/modules/tabs.js'
import {includeHeadersInData, hasAllColumnNames, hasAllColumnTypes} from '@/frictionlessUtilities.js'
import {allTablesAllColumnsFromSchema$} from '@/rxSubject.js'
import stringify from 'csv-stringify'
import csv from 'csvtojson'
import promisePipe from 'promisepipe'

async function inferSchema(data) {
  const schema = await Schema.load({})
  // workaround for schema.infer stripping headers
  let dataClone = [...data]
  let headers = dataClone.shift()
  // frictionless default for csv dialect is that tables DO have headers
  // await schema.infer(data, {headers: 0})
  await schema.infer(dataClone, {headers: headers})
  console.log(schema)
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
  console.log(tableRows)
  console.log(row)
  // if row contains foreign relation objects cast the original
  try {
    if (_.isArray(tableRows)) {
      schema.castRow(tableRows[rowNumber - 1])
    } else {
      schema.castRow(row)
    }
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
  console.log('inside collate foreign keys...')
  const foreignKeys = store.state.hotTabs[localHotId].tableProperties.foreignKeys
  if (typeof foreignKeys === 'undefined') {
    return false
  }
  console.log('foreign keys detected...')
  let relations = {}
  for (const foreignKey of foreignKeys) {
    let foreignHotId = getHotIdFromForeignKeyForeignTable(foreignKey.reference.resource, localHotId)
    // foreign keys must also have column properties set
    if (!hasColumnProperties(foreignHotId, callback)) {
      relations = false
      break
    }
    let data = getForeignKeyData(foreignHotId)
    // let json = []
    let schema = await buildSchema(data, foreignHotId)
    let table = await createFrictionlessTable(data, schema)
    let rows = await table.read({keyed: true})
    console.log('have schema fields')
    console.log(schema.fields)
    console.log('have foreign table')
    console.log(table)
    console.log('have rows')
    console.log(rows)
    // send data and headers separately to csvToJson
    // let headers = data.shift()
    // console.log('calling csv to json...')
    // await csvToJson(data, json, schema, foreignKey.reference.fields, schema.fields)
    // if (_.has(relations, foreignKey.reference.resource)) {
    //   console.log(`Warning: Relations key ${foreignKey.reference.resource} already exists.`)
    // }
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

// async function csvToJson(inputData, json, schema, headers, schemaFields) {
//   let stream = stringify()
//   // send headers immediately to stream
//   stream.write(headers)
//   let indicies = []
//   for (const [index, field] of schemaFields.entries()) {
//     if (indicies.length === headers.length) {
//       break
//     }
//     if (_.indexOf(headers, field.name) !== -1) {
//       indicies.push(index)
//     }
//   }
//   console.log('indicies are:')
//   console.log(indicies)
//   for (let row of inputData) {
//     // ensure foreign key values include field properties if valid
//     // let castRow
//     try {
//       // castRow = schema.castRow(row)
//       // castRow = row
//       let filteredRow = row.filter(function(elem, index, array) {
//         return schemaFields[index]
//       })
//     } catch (error) {
//       console.log('Cast row failed', error)
//       castRow = row
//     }
//     stream.write(castRow)
//   }
//   stream.end()
//   try {
//     await promisePipe(csv({checkType: true}).fromStream(stream).on('json', (row) => {
//       json.push(row)
//     }).on('done', () => {
//       console.log('completed csv to json.')
//       console.log(json)
//     }))
//   } catch (error) {
//     throw new Error('There was a problem converting csv to json.', error)
//   }
// }

function isRowBlank(row) {
  let isRowBlank = row.filter(Boolean)
  return isRowBlank.length === 0
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
  let relations = await collateForeignKeys(hotId, callback)
  let tableRows
  try {
    tableRows = await table.read()
  } catch (error) {
    console.log('cast errors on read')
    console.log(error)
  }
  const stream = await table.iter({keyed: false, extended: true, stream: true, cast: true, relations: relations})
  stream.on('data', (row) => {
    // TODO: consider better way to accommodate or remove - need headers/column names so this logic may be redundant
    let rowNumber = hasColHeaders
      ? row[0]
      : row[0] + 1
    if (isRowBlank(row[2])) {
      errorCollector.push({rowNumber: rowNumber, message: `Row ${rowNumber} is completely blank`, name: 'Blank Row'})
    }
    checkRow(rowNumber, row[2], table.schema, tableRows, errorCollector)
  })
  stream.on('error', (error) => {
    console.log(error)
    errorHandler(error, 'N/A', errorCollector)
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
  // if (!hasAllColumnTypes(hotId, columnProperties)) {
  //   callb([
  //     {
  //       rowNumber: 0,
  //       message: `Every Column property, including the column properties of any foreign keys, must have a 'type'.`,
  //       name: 'Missing Column Property types'
  //     }
  //   ])
  //   return false
  // }
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
