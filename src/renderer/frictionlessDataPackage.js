import {Resource, Package, validate} from 'datapackage'
import {HotRegister} from '@/hot.js'
import tabStore from '@/store/modules/tabs.js'
import hotStore from '@/store/modules/hots.js'
import path from 'path'
import {includeHeadersInData} from '@/frictionlessUtils.js'
import fs from 'fs-extra'

async function initResourceAndInfer() {
  console.log('trying to init blank resource...')
  const resource = await Resource.load()
  console.log('trying to infer blank resource...')
  await resource.infer()
  console.log('returning resource')
  return resource
}

function addColumnProperties(resource, hotId) {
  let columnProperties = hotStore.state.hotTabs[hotId].columnProperties
  resource.descriptor.schema = {}
  resource.descriptor.schema.fields = columnProperties
}

function addTableProperties(resource, hotId) {
  let tableProperties = hotStore.state.hotTabs[hotId].tableProperties
  console.log('got table properties...')
  console.log(tableProperties)
  _.merge(resource.descriptor, tableProperties)
  if (resource.descriptor.licenses && resource.descriptor.licenses.length === 0) {
    // console.log('removing licenses')
    _.unset(resource.descriptor, 'licenses')
  }
}

function addPackageProperties(dataPackage) {
  let packageProperties = hotStore.state.hotTabs.packageProperties
  console.log('package properties...')
  console.log(dataPackage)
  _.merge(dataPackage.descriptor, packageProperties)
  console.log(dataPackage)
}

export function haveAllTabsGotFilenames() {
  return tabStore.getters.getTabFilenames(tabStore.state).length === tabStore.state.tabs.length
}

function hasAllRequirements(hot, requiredMessages) {
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
  console.log(`filename is ${filename}`)
  let basename = path.basename(filename)
  console.log(`basename is ${basename}`)
  let resourcePath = `${parent}/${basename}`
  console.log(resourcePath)
  resource.descriptor.path = resourcePath
  copyAbsoluteToRelative(filename, resource.descriptor.path)
}

async function createValidResource(tabId, hotId) {
  console.log('entered create valid resource...')
  let resource = await initResourceAndInfer()
  console.log('add path...')
  addPath(resource, tabId)
  console.log('add column properties...')
  addColumnProperties(resource, hotId)
  console.log('add table properties...')
  addTableProperties(resource, hotId)
  resource.commit()
  console.log('returning resource...')
  console.log(resource)
  return resource
}

async function initPackage() {
  const dataPackage = await Package.load()
  // await dataPackage.infer(data)
  console.log('returning init package...')
  return dataPackage
}

function createZipFile() {
  dialog.showSaveDialog({}, function(filename) {
    if (filename === undefined) {
      return
    }
    saveAndExit(callback, filename)
  })
}

export async function createDataPackage() {
  let dataPackage = await initPackage()
  let errorMessages = []
  if (!haveAllTabsGotFilenames()) {
    errorMessages.push('All tabs must be saved before exporting.')
  }
  for (let hotId in hotStore.state.hotTabs) {
    console.log(`key is ${hotId}`)
    let value = hotStore.state.hotTabs[hotId]
    console.log(value)
    // _.forEach(hotStore.state.hotTabs, async function(hotTab, key) {
    console.log('next iteration...')
    try {
      let hot = HotRegister.getInstance(key)
      console.log('checking requirements...')
      if (!hasAllRequirements(hot, errorMessages)) {
        return false
      }
      console.log('checking is valid...')
      let resource = await createValidResource(hotTab.tabId, hot.guid)
      console.log('returned from resource is valid')
      if (!resource.valid) {
        console.log(resource.errors)
        errorMessages.push('There is a required table or column property that is missing. Please check that all required properties are entered.')
        return false
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
  console.log('error messages...')
  console.log(errorMessages)
  if (errorMessages.length > 0) {
    return errorMessages
  }
  console.log('adding package properties...')
  addPackageProperties(dataPackage)
  console.log('package now...')
  console.log(dataPackage)
  return errorMessages
}

function copyAbsoluteToRelative(source, destination) {
  try {
    let absoluteDestination = path.resolve(__dirname, destination)
    fs.ensureDirSync(path.dirname(absoluteDestination))
    fs.copySync(source, absoluteDestination)
  } catch (err) {
    console.log(`There was a problem creating files`)
    console.error(err)
  }

// try {
//   await fs.ensureDir(dir, err => {
//     if (err) {
//       console.log(err) // => null
//     } else {
//       console.log('Directory created.')
//     }
//     // dir has now been created, including the directory it is to be placed in
//   })
// } catch (error) {
//   console.log('There was a problem writing dir')
//   console.log(error)
// }
// if (!fs.existsSync(dir)) {
//   let fileStatus = fs.mkdir(dir, function(err) {
//     if (err) {
//       console.log('There was a problem creating directories.')
//       console.log(err)
//     } else {
//       console.log('Directory created.')
//     }
//   })
// } else {
//   console.log(`Directory, ${dir}, already exists.`)
// }
}
