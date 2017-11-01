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

async function createResource(hot) {
  const resource = await Resource.load({path: 'data.csv'})
}

export function haveAllTabsGotFilenames() {
  return tabStore.getAllFilenames().length === tabStore.state.tabs.length
}

export async function createDataPackage() {
  let allHots = HotRegister.hots
  let allTabObjects = tabStore.state.tabObjects
  // first check that all tabs are saved
  if (!haveAllTabsGotFilenames()) {
    return 'All tabs must be saved before exporting.'
  }
  console.log(hotStore.state.hotTabs)
  console.log(allTabObjects)
  // get tab Id and use this to get filename
  _.forEach(hotStore.state.hotTabs, (value, key) => {
    console.log('hot id is: ')
    console.log(key)
    console.log(`tab is`)
    console.log(value.tabId)
    console.log('filename is')
    console.log(allTabObjects[value.tabId].filename)
  })

  // }
  // for each hot:
  // get tab Id for each hot

  // let package = await initPackage(allHots)
}
