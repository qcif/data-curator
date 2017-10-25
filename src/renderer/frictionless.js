import {Table} from 'tableschema'
import {Resource, Package} from 'datapackage'
import {HotRegister} from '../renderer/hot.js'
import store from '../renderer/store/modules/hots.js'

async function initPackage(data) {
  const dataPackage = await Package.load()
  await dataPackage.infer(data)
  return dataPackage
}

async function initDataAndInferSchema(data) {
  const table = await Table.load(data)
  await table.infer()
  return table
}

async function initData(data) {
  const table = await Table.load(data)
  return table
}

async function initStrictData(data) {
  const table = await Table.load(data, {strict: true})
  return table
}

async function initDataAgainstSchema(data, schema) {
  // provide schema rather than infer
  let table = await Table.load(data, {schema: schema})
  return table
}

function updateDataForHeaders(hot) {
  let allData = hot.getData()
  if (hot.hasColHeaders()) {
    let headers = hot.getColHeader()
    allData = _.concat([headers], allData)
  }
  return allData
}

function storeData(hotId, table) {
  return store.mutations.pushTableSchema(store.state, {
    hotId: hotId,
    tableSchema: table
  })
}

export async function guessColumnProperties() {
  let hot = HotRegister.getActiveInstance()
  let id = hot.guid
  let data = updateDataForHeaders(hot)
  // let activeHot = HotRegister.getActiveHotIdData()
  let table = await initDataAndInferSchema(data)
  let isStored = storeData(id, table)
  let message = isStored ? 'Success: Guess column properties succeeded.' : 'Failed: Guess column properties failed.'
  return message
}

// function checkRowCells(row, schema) {
//   try {
//     console.log('checking each cell of row:')
//     console.log(row)
//     let indexCount = -1
//
//     for (const [index, cell] of row.entries()) {
//       console.log(`index is ${index}`)
//       console.log(`cell value is ${cell}`)
//       const field = schema.fields[index]
//       console.log('logging field...')
//       console.log(field)
//       field.castValue(cell, false)
//     }
//   } catch (err) {
//     console.log('got cell error')
//     console.log(err)
//     // if (err.multiple) {
//     //   for (const error of err.errors) {
//     //     console.log(error)
//     //   }
//     // } else {
//     //   console.log(err)
//     // }
//   }
// }

function checkRow(rowNumber, row, schema, errorCollector) {
  try {
    schema.castRow(row)
  } catch (err) {
    if (err.multiple) {
      for (const error of err.errors) {
        console.log(error)
        errorCollector.push({rowNumber: rowNumber, message: error.message, name: error.name})
      }
    } else {
      console.log(err)
    }
  }
}

// export async function validateActiveDataWithNoSchema() {
//   let activeHotObject = HotRegister.getActiveHotIdData()
//   try {
//     let table = await initStrictData(activeHotObject.data)
//     let result = await table.read({keyed: true})
//   } catch (err) {
//     if (err.multiple) {
//       for (const error of err.errors) {
//         console.log(error)
//       }
//     } else {
//       console.log(err)
//     }
//   }
// }

async function checkForSchema(data, id) {
  let tableSchema = _.get(store.state.hotTabs, `${id}.tableSchema`)
  if (!tableSchema) {
    tableSchema = await initDataAndInferSchema(data)
  }
  let table = await initDataAgainstSchema(data, tableSchema.schema)
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
  console.log('checking header errors')
  let rowNumber = hasColHeaders ? 0 : 1
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
  let id = hot.guid
  let data = updateDataForHeaders(hot)
  // let activeHotObject = HotRegister.getActiveHotIdData()
  const errorCollector = []
  checkHeaderErrors(data[0], errorCollector, hot.hasColHeaders())
  let table = await checkForSchema(data, id)
  // don't cast at stream, wait until row to cast otherwise not all errors will be reported.
  const stream = await table.iter({
    extended: true,
    stream: true,
    cast: false
  })
  stream.on('data', (row) => {
    let rowNumber = hot.hasColHeaders() ? row[0] - 1 : row[0]
    if (isRowBlank(row[2])) {
      errorCollector.push({rowNumber: rowNumber, message: `Row ${rowNumber} is completely blank`, name: 'Blank Row'})
    }
    checkRow(rowNumber, row[2], table.schema, errorCollector)
  })
  stream.on('end', () => {
    callback(errorCollector)
  })
}
