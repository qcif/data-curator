import {Resource, Package} from 'datapackage'
import {HotRegister} from '@/hot.js'
import tabStore from '@/store/modules/tabs.js'
import hotStore from '@/store/modules/hots.js'
import path from 'path'

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

// async function createResource(filename) {
//   let basename = path.basename(filename)
//   console.log(`basename is ${basename}`)
//   let dirname = path.dirname(filename)
//   console.log(`dirname is ${dirname}`)
//   const resource = await Resource.load({basepath: dirname, path: basename})
//   console.log(resource)
//   // let object = await resource.read({keyed: true})
//   // console.log(object)
//   return resource
// }
async function createResource(id) {
  // let basename = path.basename(filename)
  // console.log(`basename is ${basename}`)
  // let dirname = path.dirname(filename)
  // console.log(`dirname is ${dirname}`)
  const resource = await Resource.load({data: HotRegister.getInstance(id)})
  console.log(resource)
  // let object = await resource.read({keyed: true})
  // console.log(object)
  return resource
}

export function haveAllTabsGotFilenames() {
  return tabStore.getters.getTabFilenames(tabStore.state).length === tabStore.state.tabs.length
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
  await _.forEach(hotStore.state.hotTabs, async function (value, key) {
    console.log('hot id is: ')
    console.log(key)
    console.log(`tab is`)
    console.log(value.tabId)
    console.log('filename is')
    let filename = allTabObjects[value.tabId].filename
    try {
      // let resource = await createResource(filename)
      let resource = await createResource(key)
    } catch (err) {
      if (err) {
        console.log('There was an error creating resource.')
        console.log(err)
      }
    }
  })
  return 'Data package export completed'
}
