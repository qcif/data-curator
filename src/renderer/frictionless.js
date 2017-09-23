import {Table} from 'tableschema'
import {Resource, Package} from 'datapackage'
import {HotRegister} from '../renderer/hot.js'

async function initData(data) {
  console.log('init data...')
  const table = await Table.load(data)
  await table.infer()
  return table
}

async function getDescriptor(data) {
  let table = await initData(data)
  let tableDescriptor = table.schema.descriptor
  console.log('got table descriptor...')
  return tableDescriptor
}

export async function guessColumnProperties() {
  let activeHot = HotRegister.getActiveHotIdData()
  let tableDescriptor = await getDescriptor(activeHot.data)
  return {
    'hotId': activeHot.id,
    'columnProperties': tableDescriptor.fields
  }
}

export async function validate() {
  console.log('validating...')
  let activeHot = HotRegister.getActiveHotIdData()
  let table = await initData(activeHot.data)
  table.schema.commit()
  let isSchemaValid = table.schema.valid
  console.log(isSchemaValid)
  console.log(table.schema.errors)
}
