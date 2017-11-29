import {Table, Schema} from 'tableschema'
import {HotRegister} from '../renderer/hot.js'
import store from '../renderer/store/modules/hots.js'
import {includeHeadersInData} from '@/frictionlessUtilities.js'

// async function initDataAndInferTableSchema(data) {
//   const table = await Table.load(data)
//   await table.infer()
//   return table
// }

async function initDataAndInferSchema(data) {
  const schema = await Schema.load({})
  await schema.infer(data)
  // console.log('returning from infer')
  return schema
}

async function initDataAgainstSchema(data, schema) {
  // provide schema rather than infer
  let table = await Table.load(data, {schema: schema})
  return table
}

function storeData(hotId, schema) {
  return store.mutations.pushTableSchema(store.state, {
    hotId: hotId,
    // tableSchema: table.schema,
    schema: schema
  })
}

export async function guessColumnProperties() {
  // console.log('guessing...')
  let hot = HotRegister.getActiveInstance()
  let id = hot.guid
  let data = includeHeadersInData(hot)
  // let activeHot = HotRegister.getActiveHotIdData()
  let schema = await initDataAndInferSchema(data)
  let isStored = storeData(id, schema)
  let message = isStored
    ? 'Success: Guess column properties succeeded.'
    : 'Failed: Guess column properties failed.'
  console.log('returning from guess column properties...')
  return message
}

function checkRow(rowNumber, row, schema, errorCollector) {
  try {
    schema.castRow(row)
  } catch (err) {
    if (err.multiple) {
      for (const error of err.errors) {
        console.log('got next error')
        console.log(error)
        errorCollector.push({rowNumber: rowNumber, message: error.message, name: error.name})
      }
    } else {
      console.log('got next error')
      console.log(err)
      errorCollector.push({rowNumber: rowNumber, message: err.message, name: err.name})
    }
  }
}

async function checkForSchema(data, hotId) {
  let columnProperties = store.state.hotTabs[hotId].columnProperties
  // let schema = loadSchema(data, columnProperties)
  // const schema = await Schema.load({})
  // await schema.infer(data)
  let schema = await initDataAndInferSchema(data)
  // tableSchema.schema.descriptor.fields = columnProperties
  schema.descriptor.fields = columnProperties
  // let table = await initDataAgainstSchema(data, tableSchema.schema)
  let table = await initDataAgainstSchema(data, schema)
  table.schema.commit()
  console.log(table.schema.valid)
  console.log(table.schema.errors)
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
  console.log('checking header errors')
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
    console.log('getting next row')
    console.log(row)
    let rowNumber = hot.hasColHeaders()
      ? row[0] - 1
      : row[0]
    if (isRowBlank(row[2])) {
      errorCollector.push({rowNumber: rowNumber, message: `Row ${rowNumber} is completely blank`, name: 'Blank Row'})
    }
    checkRow(rowNumber, row[2], table.schema, errorCollector)
  })
  stream.on('end', () => {
    callback(errorCollector)
  })
}
