import {Table, Schema} from 'tableschema'
import {HotRegister} from '@/hot.js'
import store from '@/store/modules/hots.js'
import {includeHeadersInData, hasAllColumnNames} from '@/frictionlessUtilities.js'
import {allTablesAllColumnsFromSchema$} from '@/rxSubject.js'

async function initDataAndInferSchema(data) {
  const schema = await Schema.load({})
  await schema.infer(data)
  return schema
}

async function initDataAgainstSchema(data, schema) {
  // provide schema rather than infer
  // frictionless default for csv dialect is that tables DO have headers
  let table = await Table.load(data, {schema: schema, headers: 0})
  return table
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
  let schema = await initDataAndInferSchema(data)
  let isStored = storeData(id, schema)
  allTablesAllColumnsFromSchema$.next(store.getters.getAllHotTablesColumnProperties(store.state, store.getters)())
  let message = isStored
    ? 'Success: Guess column properties succeeded.'
    : 'Failed: Guess column properties failed.'
  return message
}

function checkRow(rowNumber, row, schema, errorCollector) {
  try {
    console.log(schema)
    schema.castRow(row)
  } catch (err) {
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
}

async function checkForSchema(data, hotId) {
  let columnProperties = store.state.hotTabs[hotId].columnProperties
  let schema = await initDataAndInferSchema(data)
  schema.descriptor.fields = columnProperties
  let table = await initDataAgainstSchema(data, schema)
  table.schema.commit()
  return table
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

function hasColumnProperties(hotId, callb) {
  let columnProperties = store.state.hotTabs[hotId].columnProperties
  if (!columnProperties || columnProperties.length === 0) {
    callb([
      {
        rowNumber: 0,
        message: `Column properties must be set.`,
        name: 'No Column Properties'
      }
    ])
    return false
  }
  if (!hasAllColumnNames(hotId, columnProperties)) {
    callb([
      {
        rowNumber: 0,
        message: `Every Column property must have a 'name'.`,
        name: 'Missing Column Property names'
      }
    ])
    return false
  }
  return true
}

export async function validateActiveDataAgainstSchema(callback) {
  let hot = HotRegister.getActiveInstance()
  let id = hot.guid
  if (!hasColumnProperties(id, callback)) {
    return
  }
  let data = includeHeadersInData(hot)
  const errorCollector = []
  checkHeaderErrors(data[0], errorCollector, hot.hasColHeaders())
  let table = await checkForSchema(data, id)
  // don't cast at stream, wait until row to cast otherwise not all errors will be reported.
  const stream = await table.iter({extended: true, stream: true, cast: false})
  stream.on('data', (row) => {
    // TODO: consider better way to accommodate or remove - need headers/column names so this logic may be redundant
    let rowNumber = hot.hasColHeaders()
      ? row[0]
      : row[0] + 1
    if (isRowBlank(row[2])) {
      errorCollector.push({rowNumber: rowNumber, message: `Row ${rowNumber} is completely blank`, name: 'Blank Row'})
    }
    checkRow(rowNumber, row[2], table.schema, errorCollector)
  })
  stream.on('end', () => {
    callback(errorCollector)
  })
}
