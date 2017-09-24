import {Table} from 'tableSchema'
import {Resource, Package} from 'datapackage'
import {HotRegister} from '../renderer/hot.js'
import store from '../renderer/store/modules/hots.js'

async function initData(data) {
  const table = await Table.load(data)
  await table.infer()
  return table
}

async function storeData(hotId, table) {
  console.log('init and storing data...')
  await store.mutations.pushTableSchema(store.state, {
    hotId: hotId,
    tableSchema: table
  })
}

async function getDescriptor(activeHotObject) {
  let table = await initData(activeHotObject.data)
  let tableDescriptor = table.schema.descriptor
  console.log('got table descriptor...')
  return tableDescriptor
}

export async function guessColumnProperties() {
  let activeHotObject = HotRegister.getActiveHotIdData()
  let table = await initData(activeHotObject.data)
  // storeData(activeHotObject.id, table)
  let tableDescriptor = table.schema.descriptor
  return {'hotId': activeHotObject.id, 'columnProperties': tableDescriptor.fields}
}

export async function validateActiveData() {
  let activeHotObject = HotRegister.getActiveHotIdData()
  let table = _.get(store.state.hotTabs, store.state.getters, activeHotObject.id)
  console.log('table before commit')
  console.log(table)
  table.schema.commit()
  console.log(table)
  console.log(table.schema.valid)
  // await table.read({keyed: true, extended: true})
  // const stream = await table.iter({keyed: true, stream: true})
  let table2 = initData(activeHotObject)
  try {
    const stream = await table2.iter(table.schema, {
      keyed: true,
      extended: true,
      stream: true
    })
    stream.on('data', (row) => {
      // handle row ['london', [51.50,-0.11]] etc
      console.log('next row')
      console.log(row)
    }).on('error', function(err) {
      console.log(err)
      if (err.multiple) {
        for (const error of err.errors) {
          console.log(error)
        }
      }
    })
  } catch (err) {
    // keyed/extended/cast supported in a stream mode too
    console.log('caught error')
    console.log(err)
    // if (err.multiple) {
    //   for (const error of err.errors) {
    //     console.log(error)
    //   }
    // }
  }
}
