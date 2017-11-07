import {Resource, Package, validate} from 'datapackage'
import {HotRegister} from '@/hot.js'
import tabStore from '@/store/modules/tabs.js'
import hotStore from '@/store/modules/hots.js'
import path from 'path'
import {includeHeadersInData} from '@/frictionlessUtils.js'
import {createZipFile} from '@/exportPackage.js'
import fs from 'fs-extra'

async function initResourceAndInfer() {
  const resource = await Resource.load()
  await resource.infer()
  return resource
}

function addColumnProperties(resource, hotId) {
  let columnProperties = hotStore.state.hotTabs[hotId].columnProperties
  resource.descriptor.schema = {}
  resource.descriptor.schema.fields = columnProperties
}

function addTableProperties(resource, hotId) {
  let tableProperties = hotStore.state.hotTabs[hotId].tableProperties
  _.merge(resource.descriptor, tableProperties)
  if (resource.descriptor.licenses && resource.descriptor.licenses.length === 0) {
    _.unset(resource.descriptor, 'licenses')
  }
}

function addPackageProperties(dataPackage) {
  let packageProperties = hotStore.state.hotTabs.packageProperties
  _.merge(dataPackage.descriptor, packageProperties)
}

export function haveAllTabsGotFilenames() {
  return tabStore.getters.getTabFilenames(tabStore.state).length === tabStore.state.tabs.length
}

function hasAllResourceRequirements(hot, requiredMessages) {
  if (!hotStore.state.hotTabs[hot.guid].tableProperties) {
    requiredMessages.push(`Table properties must be set.`)
  } else {
    let name = hotStore.state.hotTabs[hot.guid].tableProperties.name
    if (!name || name.trim() === '') {
      requiredMessages.push(`Table property, 'name', must not be empty.`)
    }
  }
  if (!hotStore.state.hotTabs[hot.guid].columnProperties) {
    requiredMessages.push(`Column properties must be set.`)
  }
  return requiredMessages.length === 0
}

function hasAllPackageRequirements(requiredMessages) {
  if (!hotStore.state.provenanceProperties || !hotStore.state.provenanceProperties.markdown) {
    requiredMessages.push(`Provenance properties must be set.`)
  }
  if (!hotStore.state.packageProperties) {
    requiredMessages.push(`Package properties must be set.`)
  }
  return requiredMessages.length === 0
}

function addPath(resource, tabId) {
  let parent = 'data'
  let filename = tabStore.state.tabObjects[tabId].filename
  let basename = path.basename(filename)
  let resourcePath = `${parent}/${basename}`
  resource.descriptor.path = resourcePath
  // resource.descriptor.path = basename
  // copyAbsoluteToRelative(filename, resource.descriptor.path)
}

async function buildResource(tabId, hotId) {
  let resource = await initResourceAndInfer()
  addColumnProperties(resource, hotId)
  addTableProperties(resource, hotId)
  addPath(resource, tabId)
  resource.commit()
  return resource
}

async function initPackage() {
  const dataPackage = await Package.load()
  return dataPackage
}

async function createValidResource(hotId, errorMessages) {
  let hotTab = hotStore.state.hotTabs[hotId]
  let hot = HotRegister.getInstance(hotId)
  if (!hasAllResourceRequirements(hot, errorMessages)) {
    return false
  }
  let resource = await buildResource(hotTab.tabId, hot.guid)
  if (!resource.valid) {
    errorMessages.push('There is a required table or column property that is missing. Please check that all required properties are entered.')
    return false
  }
  return resource
}

async function buildAllResourcesForDataPackage(dataPackage, errorMessages) {
  for (let hotId in hotStore.state.hotTabs) {
    try {
      let resource = await createValidResource(hotId, errorMessages)
      if (!resource) {
        break
      }
      dataPackage.addResource(resource.descriptor)
    } catch (err) {
      if (err) {
        console.log('There was an error creating a resource.')
        console.log(err)
        return false
      }
    }
  }
}

async function buildDataPackage(errorMessages) {
  if (!hasAllPackageRequirements(errorMessages)) {
    return false
  }
  let dataPackage = await initPackage()
  addPackageProperties(dataPackage)
  await buildAllResourcesForDataPackage(dataPackage, errorMessages)
}

export async function createDataPackage() {
  let errorMessages = []
  if (!haveAllTabsGotFilenames()) {
    errorMessages.push('All tabs must be saved before exporting.')
  }
  let dataPackage = await buildDataPackage(errorMessages)
  if (errorMessages.length > 0) {
    return errorMessages
  }
  console.log('package now...')
  console.log(dataPackage)
  createZipFile()
  return errorMessages
}

// function copyAbsoluteToRelative(source, destination) {
//   try {
//     let absoluteDestination = path.resolve(__dirname, destination)
//     fs.ensureDirSync(path.dirname(absoluteDestination))
//     fs.copySync(source, absoluteDestination)
//   } catch (err) {
//     console.log(`There was a problem creating files`)
//     console.error(err)
//   }
// }
