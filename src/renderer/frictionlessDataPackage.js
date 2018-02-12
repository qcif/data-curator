import {Resource, Package, validate} from 'datapackage'
import {HotRegister} from '@/hot.js'
import tabStore from '@/store/modules/tabs.js'
import hotStore from '@/store/modules/hots.js'
import path from 'path'
import {createZipFile} from '@/exportPackage.js'
import {hasAllColumnNames} from '@/frictionlessUtilities.js'

export async function createDataPackage() {
  const errorMessages = []
  if (!haveAllTabsGotFilenames()) {
    errorMessages.push('All tabs must be saved before exporting.')
  }
  try {
    let dataPackage = await buildDataPackage(errorMessages)
    if (errorMessages.length > 0) {
      return errorMessages
    }
    if (dataPackage) {
      dataPackage.commit()
      if (!dataPackage.valid) {
        errorMessages.push('There is a problem with at least 1 package property. Please check and try again.')
        return errorMessages
      }
      createZipFile(JSON.stringify(dataPackage.descriptor))
    }
  } catch (err) {
    if (err) {
      console.log('There was an error creating the data package.', err)
    }
  }
  return errorMessages
}

export function haveAllTabsGotFilenames() {
  return tabStore.getters.getTabFilenames(tabStore.state).length === tabStore.state.tabs.length
}

async function buildDataPackage(errorMessages) {
  if (!hasAllPackageRequirements(errorMessages)) {
    return false
  }
  let dataPackage = await initPackage()
  await buildAllResourcesForDataPackage(dataPackage, errorMessages)
  // adding package properties for validation only
  addPackageProperties(dataPackage.descriptor)
  return dataPackage
}

function hasAllPackageRequirements(requiredMessages) {
  if (!hotStore.state.provenanceProperties || !hotStore.state.provenanceProperties.markdown) {
    requiredMessages.push(`Provenance properties must be set.`)
  }
  let packageProperties = hotStore.state.packageProperties
  if (!packageProperties || _.isEmpty(packageProperties)) {
    requiredMessages.push(`Package properties must be set.`)
  } else {
    let name = packageProperties.name
    if (!name || name.trim() === '') {
      requiredMessages.push(`Package property, 'name' must be set.`)
    }
    addSourcesRequirements(packageProperties, requiredMessages, 'package')
    addContributorsRequirements(packageProperties, requiredMessages, 'package')
  }
  return requiredMessages.length === 0
}

async function initPackage() {
  const dataPackage = await Package.load()
  return dataPackage
}

function addPackageProperties(descriptor) {
  let packageProperties = hotStore.state.packageProperties
  _.merge(descriptor, packageProperties)
  removeEmptiesFromDescriptor(descriptor)
}

async function buildAllResourcesForDataPackage(dataPackage, errorMessages) {
  const resourcePaths = []
  for (let hotId in hotStore.state.hotTabs) {
    try {
      let resource = await createValidResource(hotId, errorMessages)
      if (!resource) {
        console.log(`did not add resource: ${hotId}`)
        break
      }
      if (resourcePaths.indexOf(resource.descriptor.path) !== -1) {
        errorMessages.push('There is at least 1 tab with the same title. Each tab must have a unique title.')
        break
      }
      resourcePaths.push(resource.descriptor.path)
      dataPackage.addResource(resource.descriptor)
    } catch (err) {
      if (err) {
        console.log('There was an error creating a resource.', err)
        return false
      }
    }
  }
}

async function createValidResource(hotId, errorMessages) {
  let hotTab = hotStore.state.hotTabs[hotId]
  let hot = HotRegister.getInstance(hotId)
  if (!hasAllResourceRequirements(hot, errorMessages)) {
    return false
  }
  let resource = await buildResource(hotTab.tabId, hot.guid)
  if (!resource.valid) {
    console.log(resource.errors)
    errorMessages.push('There is a required table or column property that is missing. Please check that all required properties are entered.')
    return false
  }
  return resource
}

function hasAllResourceRequirements(hot, requiredMessages) {
  let tableProperties = hotStore.state.hotTabs[hot.guid].tableProperties
  if (!tableProperties) {
    requiredMessages.push(`Table properties must be set.`)
  } else {
    let name = tableProperties.name
    if (!name || name.trim() === '') {
      requiredMessages.push(`Table property, 'name', must not be empty.`)
    }
    addSourcesRequirements(tableProperties, requiredMessages, 'table')
    addForeignKeyRequirements(tableProperties, requiredMessages)
  }
  let columnProperties = hotStore.state.hotTabs[hot.guid].columnProperties
  if (!columnProperties) {
    requiredMessages.push(`Column properties must be set.`)
  } else {
    if (!hasAllColumnNames(hot.guid, columnProperties)) {
      requiredMessages.push(`Column property names cannot be empty.`)
    }
  }
  return requiredMessages.length === 0
}

function addSourcesRequirements(properties, requiredMessages, entityName) {
  if (typeof properties.sources === 'undefined') {
    return
  }
  for (let source of properties.sources) {
    if (hasAllEmptyValues(source)) {
      _.pull(properties.sources, source)
    } else if (!source.title || source.title.trim() === '') {
      requiredMessages.push(`At least 1 ${entityName} source does not have a title.`)
      return false
    } else {
      // console.log('source is valid')
    }
  }
}

function addContributorsRequirements(properties, requiredMessages, entityName) {
  if (typeof properties.contributors === 'undefined') {
    return
  }
  for (let contributor of properties.contributors) {
    if (hasAllEmptyValues(contributor)) {
      _.pull(properties.contributors, contributor)
    } else if (!contributor.title || contributor.title.trim() === '') {
      requiredMessages.push(`At least 1 ${entityName} contributor does not have a title.`)
      return false
    } else {
      // console.log('contributor is valid')
    }
  }
}

function hasAllEmptyValues(propertyObject) {
  let isEmpty = true
  _.forOwn(propertyObject, function(value, key) {
    if (value.trim().length > 0) {
      isEmpty = false
      return false
    }
  })
  return isEmpty
}

function addForeignKeyRequirements(tableProperties, requiredMessages) {
  if (typeof tableProperties.foreignKeys === 'undefined') {
    return
  }
  for (let foreignKey of tableProperties.foreignKeys) {
    if (_.isEmpty(foreignKey.fields) || _.isEmpty(foreignKey.reference.fields)) {
      requiredMessages.push(`Foreign keys cannot be empty.`)
      return false
    }
  }
}

async function buildResource(tabId, hotId) {
  let resource = await initResourceAndInfer()
  let descriptor = resource.descriptor
  addColumnProperties(descriptor, hotId)
  addTableProperties(descriptor, hotId)
  removeEmptiesFromDescriptor(descriptor)
  addPath(descriptor, tabId)
  resource.commit()
  return resource
}

async function initResourceAndInfer() {
  const resource = await Resource.load()
  await resource.infer()
  return resource
}

function addColumnProperties(descriptor, hotId) {
  let columnProperties = hotStore.state.hotTabs[hotId].columnProperties
  descriptor.schema = {}
  descriptor.schema.fields = columnProperties
}

function addTableProperties(descriptor, hotId) {
  let tableProperties = hotStore.state.hotTabs[hotId].tableProperties
  _.merge(descriptor, tableProperties)
  moveMissingValues(descriptor, tableProperties)
}

function moveMissingValues(descriptor, tableProperties) {
  _.unset(descriptor, 'missingValues')
  descriptor.schema.missingValues = tableProperties.missingValues
}

function removeEmptiesFromDescriptor(descriptor) {
  removeEmpty(descriptor, 'licenses')
  removeEmpty(descriptor, 'sources')
}

function removeEmpty(descriptor, propertyName) {
  if (descriptor[propertyName] && descriptor[propertyName].length === 0) {
    _.unset(descriptor, propertyName)
  }
}

function addPath(descriptor, tabId) {
  let parent = 'data'
  let filename = tabStore.state.tabObjects[tabId].filename
  let basename = path.basename(filename)
  descriptor.path = `${parent}/${basename}`
}
