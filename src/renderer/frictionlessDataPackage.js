import {Resource, Package} from 'datapackage'
import {HotRegister} from '@/hot.js'
import store from '@/store/modules/hots.js'

async function initPackage(hots) {
  const dataPackage = await Package.load({
    name: 'package',
    resources: [
      {
        name: 'resource',
        data: ['data']
      }
    ]
  })
  await dataPackage.infer(data)
  return dataPackage
}

export async function createDataPackage(callback) {
  let allHots = HotRegister.hots
  // first check that all tabs are saved
  console.log(store.state.hotTabs)
  let message = 'test'
  callback(message)
  // let package = await initPackage(allHots)
}
