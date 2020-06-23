import { Package, Resource } from 'datapackage'
import { HotRegister } from '@/hot.js'
import tabStore from '@/store/modules/tabs.js'
import hotStore from '@/store/modules/hots.js'
import path from 'path'
import { createJsonFile, createZipFile } from '@/exportPackage.js'
import { getValidNames, hasAllColumnNames } from '@/frictionlessUtilities.js'
import _ from 'lodash'

export async function createDataPackageAsZippedResources () {
  const errorMessages = await createDataPackage(createZipFile)
  return errorMessages
}

export async function createDataPackageAsJson () {
  const errorMessages = await createDataPackage(createJsonFile)
  return errorMessages
}

export async function createDataPackage (postCreateFunc) {
  const errorMessages = []
  if (!haveAllTabsGotFilenames()) {
    errorMessages.push('All tabs must be saved before exporting.')
  }
  try {
    let dataPackage = await buildDataPackage(errorMessages)
    if (_.isEmpty(errorMessages) && dataPackage) {
      dataPackage.commit()
      if (dataPackage.valid) {
        postCreateFunc(dataPackage.descriptor)
      } else {
        errorMessages.push('There is a problem with at least 1 package property. Please check and try again.')
      }
    }
  } catch (err) {
    console.error('There was an error creating the data package.', err)
  }
  return errorMessages
}

export function haveAllTabsGotFilenames () {
  return tabStore.getters.getTabFilenames(tabStore.state).length === tabStore.state.tabs.length
}

async function buildDataPackage (errorMessages) {
  auditPackageRequirements(errorMessages)
  let dataPackage = await initPackage()
  await buildAllResourcesForDataPackage(dataPackage, errorMessages)
  // adding package properties for validation only
  addPackageProperties(dataPackage.descriptor)
  return dataPackage
}

function auditPackageRequirements (requiredMessages) {
  if (!hotStore.state.provenanceProperties || !hotStore.state.provenanceProperties.markdown) {
    requiredMessages.push(`Provenance properties must be set.`)
  }
  let packageProperties = _.cloneDeep(hotStore.state.packageProperties)
  if (_.isEmpty(packageProperties)) {
    requiredMessages.push(`Package properties must be set.`)
  } else {
    let name = _.get(packageProperties, 'name', '').trim()
    if (_.isEmpty(name)) {
      requiredMessages.push(`Package property, 'name' must be set.`)
    }
    auditRequirementsOfPropertyList(packageProperties, requiredMessages, 'package', 'sources')
    auditRequirementsOfPropertyList(packageProperties, requiredMessages, 'package', 'contributors')
    checkReservedWordsForPropertyList(packageProperties, requiredMessages, 'package', 'customs')
  }
}

async function initPackage () {
  const dataPackage = await Package.load()
  return dataPackage
}

function addPackageProperties (descriptor) {
  let packageProperties = _.cloneDeep(hotStore.state.packageProperties)
  _.merge(descriptor, packageProperties)
  removeEmptiesFromDescriptor(descriptor)
  updateCustomsForProperties(descriptor, 'package')
}

async function buildAllResourcesForDataPackage (dataPackage, errorMessages) {
  const resourcePaths = []
  for (let hotId in hotStore.state.hotTabs) {
    try {
      let resource = await createValidResource(hotId, errorMessages)
      if (!resource) {
        console.log(`Did not add resource: ${hotId}`)
        break
      }
      if (resourcePaths.indexOf(resource.descriptor.path) !== -1) {
        errorMessages.push('There is at least 1 tab with the same title. Each tab must have a unique title.')
        break
      }
      resourcePaths.push(resource.descriptor.path)
      dataPackage.addResource(resource.descriptor)
    } catch (err) {
      console.error('There was an error creating a resource.', err)
      break
    }
  }
}

async function createValidResource (hotId, errorMessages) {
  let hotTab = hotStore.state.hotTabs[hotId]
  let hot = HotRegister.getInstance(hotId)
  auditResourceRequirements(hot, errorMessages)
  if (_.isEmpty(errorMessages)) {
    let resource = await buildResource(hotTab.tabId, hot.guid)
    if (!resource.valid) {
      console.error(resource.errors)
      errorMessages.push('There is a required table or column property that is missing. Please check that all required properties are entered.')
    }
    return resource
  }
}

function auditResourceRequirements (hot, requiredMessages) {
  let tableProperties = _.cloneDeep(hotStore.state.hotTabs[hot.guid].tableProperties)
  if (!tableProperties) {
    requiredMessages.push(`Table properties must be set.`)
  } else {
    let name = tableProperties.name
    if (!name || name.trim() === '') {
      requiredMessages.push(`Table property, 'name', must not be empty.`)
    }
    auditRequirementsOfPropertyList(tableProperties, requiredMessages, 'table', 'sources')
    auditForeignKeyRequirements(tableProperties, requiredMessages)
    checkReservedWordsForPropertyList(tableProperties, requiredMessages, 'table', 'customs')
  }
  let columnProperties = _.cloneDeep(hotStore.state.hotTabs[hot.guid].columnProperties)
  if (!columnProperties) {
    requiredMessages.push(`Column properties must be set.`)
  } else {
    let names = getValidNames(hot.guid)
    if (!hasAllColumnNames(hot.guid, columnProperties, names)) {
      requiredMessages.push(`Column property names cannot be empty - set a Header Row`)
    }
    for (const nextColumn of columnProperties) {
      checkReservedWordsForPropertyList(nextColumn, requiredMessages, 'column', 'customs')
    }
  }
}

function auditRequirementsOfPropertyList (properties, requiredMessages, entityName, propertyName, requiredAttribute = 'title') {
  const requirementsAsList = _.get(properties, propertyName)
  if (!_.isArray(requirementsAsList)) {
    return
  }
  for (let property of requirementsAsList) {
    if (hasAllEmptyValues(property)) {
      _.pull(requirementsAsList, property)
    } else {
      if (_.isEmpty(_.get(property, requiredAttribute, '').trim())) {
        requiredMessages.push(`At least 1 of ${entityName} ${propertyName} does not have a ${requiredAttribute}.`)
        break
      }
    }
  }
}

function checkReservedWordsForPropertyList (properties, requiredMessages, entityName, propertyName, requiredAttribute = 'name') {
  const requirementsAsList = _.get(properties, propertyName)
  let reserved = _.keys(properties)
  if (!_.isArray(requirementsAsList)) {
    return
  }
  for (let property of requirementsAsList) {
    const toMatch = _.get(property, requiredAttribute)
    if (_.includes(reserved, toMatch)) {
      requiredMessages.push(`${_.capitalize(entityName)} already uses: '${toMatch}', so it cannot be used again in ${entityName} '${propertyName}' properties.`)
      break
    }
  }
}

function hasAllEmptyValues (propertyObject) {
  let isEmpty = true
  _.forOwn(propertyObject, function (value, key) {
    isEmpty = _.isEmpty(_.trim(value))
    return isEmpty
  })
  return isEmpty
}

function auditForeignKeyRequirements (tableProperties, requiredMessages) {
  if (typeof tableProperties.foreignKeys === 'undefined') {
    return
  }
  for (let foreignKey of tableProperties.foreignKeys) {
    if (_.isEmpty(foreignKey.fields) || _.isEmpty(foreignKey.reference.fields)) {
      requiredMessages.push(`Foreign keys cannot be empty.`)
      break
    }
  }
}

async function buildResource (tabId, hotId) {
  let resource = await initResourceAndInfer()
  // update, rather than copy the descriptor
  let descriptor = resource.descriptor
  addColumnProperties(descriptor, hotId)
  addTableProperties(descriptor, hotId)
  removeEmptiesFromDescriptor(descriptor)
  removeNonFrictionlessKeys(descriptor)
  addPath(descriptor, tabId)
  resource.commit()
  return resource
}

async function initResourceAndInfer () {
  const resource = await Resource.load()
  await resource.infer()
  return resource
}

function addColumnProperties (descriptor, hotId) {
  let columnProperties = _.cloneDeep(hotStore.state.hotTabs[hotId].columnProperties)
  descriptor.schema = {}
  descriptor.schema.fields = columnProperties
  for (const field of descriptor.schema.fields) {
    updateCustomsForProperties(field, 'column')
  }
}

function addTableProperties (descriptor, hotId) {
  let tableProperties = _.cloneDeep(hotStore.state.hotTabs[hotId].tableProperties)
  _.merge(descriptor, tableProperties)
  moveTableSchemaProperties(descriptor, tableProperties)
  updateCustomsForProperties(descriptor, 'table')
}

function moveTableSchemaProperties (descriptor, tableProperties) {
  _.unset(descriptor, 'missingValues')
  descriptor.schema.missingValues = tableProperties.missingValues
  if (!_.isEmpty(tableProperties['primaryKeys'])) {
    _.set(descriptor, `schema.primaryKey`, tableProperties['primaryKeys'])
  }
  if (!_.isEmpty(tableProperties['foreignKeys'])) {
    _.set(descriptor, `schema.foreignKeys`, tableProperties['foreignKeys'])
  }
}

function removeEmptiesFromDescriptor (descriptor) {
  removeEmpty(descriptor, 'licenses')
  removeEmpty(descriptor, 'sources')
  removeEmpty(descriptor, 'customs')
}

function removeNonFrictionlessKeys (descriptor) {
  for (const propertyName of ['sampledQuoteChar', 'bom']) {
    _.unset(descriptor, propertyName)
  }
}

function removeEmpty (descriptor, propertyName) {
  if (_.isEmpty(_.get(descriptor, propertyName))) {
    _.unset(descriptor, propertyName)
  }
}

function addPath (descriptor, tabId) {
  let parent = 'data'
  let filename = tabStore.state.tabObjects[tabId].filename
  let basename = path.basename(filename)
  let osPath = path.join(parent, basename)
  // resource paths must be POSIX https://frictionlessdata.io/specs/data-resource/#url-or-path
  descriptor.path = _.replace(osPath, '\\', '/')
}

function updateCustomsForProperties (descriptor, customType) {
  let customs = _.get(descriptor, 'customs', [])
  _.unset(descriptor, 'customs')
  do {
    const custom = customs.pop()
    if (!_.isEmpty(_.get(custom, 'name', '')) && !_.isEmpty(_.get(custom, 'value', '')) && _.includes(_.get(custom, 'types', []), customType)) {
      _.set(descriptor, custom.name, custom.value)
    }
  } while (!_.isEmpty(customs))
}
