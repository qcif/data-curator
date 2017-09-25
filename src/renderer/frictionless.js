import {Table} from 'tableschema'
import {Resource, Package} from 'datapackage'
import {HotRegister} from '../renderer/hot.js'
import store from '../renderer/store/modules/hots.js'

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
  const table = await Table.load(data, {schema: schema})
  // await table.infer()
  return table
}

async function storeData(hotId, table) {
  console.log('init and storing data...')
  await store.mutations.pushTableSchema(store.state, {
    hotId: hotId,
    tableSchema: table
  })
}

export async function guessColumnProperties() {
  let activeHot = HotRegister.getActiveHotIdData()
  let table = await initDataAndInferSchema(activeHot.data)
  storeData(activeHot.id, table)
  let tableDescriptor = table.schema.descriptor
  return {
    'hotId': activeHot.id,
    'columnProperties': tableDescriptor.fields
  }
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
//       field.castValue(cell)
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

function checkRow(row, schema, errorCallback) {
  try {
    console.log('next row')
    console.log(row)
    schema.castRow(row)
    console.log('cast ok')
  } catch (err) {
    console.log('got row error')
    if (err.multiple) {
      for (const error of err.errors) {
        console.log(error)
      }
    } else {
      console.log(err)
    }
    // do something with the problem row
    if (errorCallback) {
      callback(row, schema)
    }
  }
}

export async function validateActiveDataWithNoSchema() {
  let activeHotObject = HotRegister.getActiveHotIdData()
  let table = await initStrictData(activeHotObject.data)
  console.log(table)
  try {
    let result = await table.read({keyed: true})
  } catch (err) {
    console.log('caught error')
    if (err.multiple) {
      for (const error of err.errors) {
        console.log(error)
      }
    } else {
      console.log(err)
    }
  }
}

export async function validateActiveDataAgainstSchema() {
  let activeHotObject = HotRegister.getActiveHotIdData()
  let table = _.get(store.state.hotTabs, `${activeHotObject.id}.tableSchema`)
  console.log(table)
  console.log(table.schema.valid)
  let table2 = await initDataAgainstSchema(activeHotObject.data, table.schema)
  console.log('table2')
  console.log(table2)
  try {
    const stream = await table2.iter({
      extended: true,
      stream: true,
      cast: false
    })
    stream.on('data', (row) => {
      // is row 'extended'
      console.log(`row number: ${row[0]}`)
      checkRow(row[2], table.schema, checkRowCells)
    }).on('error', function(err) {
      if (err.multiple) {
        for (const error of err.errors) {
          console.log(error)
        }
      } else {
        console.log(err)
      }
    })
  } catch (err) {
    console.log('caught error')
    console.log(err)
  }
}
