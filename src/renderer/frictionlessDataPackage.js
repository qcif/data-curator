import {Resource, Package, validate} from 'datapackage'
import {HotRegister} from '@/hot.js'
import tabStore from '@/store/modules/tabs.js'
import hotStore from '@/store/modules/hots.js'
import path from 'path'
import {includeHeadersInData} from '@/frictionlessUtils.js'

function hotToDescriptor(hot) {
  // let descriptor = {}
  // descriptor.data = []
  // descriptor.encoding = ''
  // descriptor.name = ''
  // descriptor.format = ''
  // descriptor.mediatype = ''
  // descriptor.path = ''
  // descriptor.profile = ''
  // descriptor.schema = {}
  let descriptor = {}
  descriptor.data = includeHeadersInData(hot)
  let tableProperties = hotStore.state.hotTabs[hot.guid].tableProperties
  let tableSchema = hotStore.state.hotTabs[hot.guid].tableSchema
  _.merge(descriptor, tableProperties)
  descriptor.schema = tableSchema.schema
  console.log(`descriptor is...`)
  console.log(descriptor)
  return descriptor
}

async function validateDescriptor(descriptor, resources) {
  const {valid, errors} = await validate(descriptor)
  if (errors) {
    for (const error of errors) {
      console.log(error)
      // TODO: report errors or fix
    }
  } else {
    resources.push(valid)
  }
}

function packageDescriptor(resources) {
  const descriptor = {
    resources: resources
  }
  return descriptor
}

async function initPackage(resources) {
  const dataPackage = await Package.load(packageDescriptor)
  // await dataPackage.infer(data)
  return dataPackage
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
  let resources = []
  await _.forEach(hotStore.state.hotTabs, async function(value, key) {
    let filename = allTabObjects[value.tabId].filename
    try {
      let hot = HotRegister.getInstance(key)
      let descriptor = hotToDescriptor(hot)
      await validateDescriptor(descriptor, resources)
      // TODO: push valid resources to array and then create data package with descriptor object
    } catch (err) {
      if (err) {
        console.log('There was an error creating resource.')
        console.log(err)
      }
    }
  })
  return 'Data package export completed'
}
