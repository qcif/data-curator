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

async function createResource(filename) {
  const resource = await Resource.load({path: filename})
  console.log(resource.headers)
  let object = await resource.read({keyed: true})
  console.log(object)
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
    console.log()
    let filename = allTabObjects[value.tabId].filename
    if (filename) {
      createResource(filename)
    }
  })

  // }
  // for each hot:
  // get tab Id for each hot

  // let package = await initPackage(allHots)
}
