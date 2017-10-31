import {Resource, Package} from 'datapackage'
import {HotRegister} from '@/hot.js'
import tabStore from '@/store/modules/tabs.js'
import hotStore from '@/store/modules/hots.js'

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

export function checkFilenameLengthMatchesTabLength() {
  let filenamesLength = tabStore.getAllFilenames()
  console.log(`filenamesLength is ${filenamesLength}`)
  console.log(filenamesLength)
  let tabsLength = tabStore.state.tabs.length
  console.log(`tabsLength is ${tabsLength}`)
}

export async function createDataPackage(callback) {
  let allHots = HotRegister.hots
  // first check that all tabs are saved
  console.log(hotStore.state.hotTabs)
  checkFilenameLengthMatchesTabLength()
  let message = 'test'
  callback(message)
  // let package = await initPackage(allHots)
}
