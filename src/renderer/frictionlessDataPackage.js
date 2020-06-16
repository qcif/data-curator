import { Resource, Package } from 'datapackage'
import { HotRegister } from '@/hot.js'
import tabStore from '@/store/modules/tabs.js'
import hotStore from '@/store/modules/hots.js'
import path from 'path'
import { createZipFile } from '@/exportPackage.js'
import { hasAllColumnNames, getValidNames } from '@/frictionlessUtilities.js'
import _ from 'lodash'

export async function createDataPackage () {
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
      createZipFile(dataPackage.descriptor)
    }
  } catch (err) {
    if (err) {
      console.error('There was an error creating the data package.', err)
    }
  }
  return errorMessages
}

export function haveAllTabsGotFilenames () {
  return tabStore.getters.getTabFilenames(tabStore.state).length === tabStore.state.tabs.length
}

async function buildDataPackage (errorMessages) {
  if (!hasAllPackageRequirements(errorMessages)) {
    return false
  }
  let dataPackage = await initPackage()
  await buildAllResourcesForDataPackage(dataPackage, errorMessages)
  // adding package properties for validation only
  addPackageProperties(dataPackage.descriptor)
  return dataPackage
}

function hasAllPackageRequirements (requiredMessages) {
  if (!hotStore.state.provenanceProperties || !hotStore.state.provenanceProperties.markdown) {
    requiredMessages.push(`Provenance properties must be set.`)
  }
  let packageProperties = hotStore.state.packageProperties
  if (_.isEmpty(packageProperties)) {
    requiredMessages.push(`Package properties must be set.`)
  } else {
    let name = _.get(packageProperties, 'name', '').trim()
    if (_.isEmpty(name)) {
      requiredMessages.push(`Package property, 'name' must be set.`)
    }
    addRequirementsForPropertyList(packageProperties, requiredMessages, 'package', 'sources')
    addRequirementsForPropertyList(packageProperties, requiredMessages, 'package', 'contributors')
    checkReservedWordsForPropertyList(packageProperties, requiredMessages, 'package', 'customs')
  }
  return requiredMessages.length === 0
}

async function initPackage () {
  const dataPackage = await Package.load()
  return dataPackage
}

function addPackageProperties (descriptor) {
  let packageProperties = hotStore.state.packageProperties
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
      if (err) {
        console.error('There was an error creating a resource.', err)
        return false
      }
    }
  }
}

async function createValidResource (hotId, errorMessages) {
  let hotTab = hotStore.state.hotTabs[hotId]
  let hot = HotRegister.getInstance(hotId)
  if (!hasAllResourceRequirements(hot, errorMessages)) {
    return false
  }
  let resource = await buildResource(hotTab.tabId, hot.guid)
  if (!resource.valid) {
    console.error(resource.errors)
    errorMessages.push('There is a required table or column property that is missing. Please check that all required properties are entered.')
    return false
  }
  return resource
}

function hasAllResourceRequirements (hot, requiredMessages) {
  let tableProperties = _.cloneDeep(hotStore.state.hotTabs[hot.guid].tableProperties)
  if (!tableProperties) {
    requiredMessages.push(`Table properties must be set.`)
  } else {
    let name = tableProperties.name
    if (!name || name.trim() === '') {
      requiredMessages.push(`Table property, 'name', must not be empty.`)
    }
    addRequirementsForPropertyList(tableProperties, requiredMessages, 'table', 'sources')
    addForeignKeyRequirements(tableProperties, requiredMessages)
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
      console.dir(nextColumn)
      checkReservedWordsForPropertyList(nextColumn, requiredMessages, 'column', 'customs')
    }
  }
  return requiredMessages.length === 0
}

function addRequirementsForPropertyList (properties, requiredMessages, entityName, propertyName, requiredAttribute = 'title') {
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
        return false
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

function addForeignKeyRequirements (tableProperties, requiredMessages) {
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

async function buildResource (tabId, hotId) {
  let resource = await initResourceAndInfer()
  let descriptor = _.cloneDeep(resource.descriptor)
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
  let columnProperties = hotStore.state.hotTabs[hotId].columnProperties
  descriptor.schema = {}
  descriptor.schema.fields = columnProperties
  for (const field of descriptor.schema.fields) {
    updateCustomsForProperties(field, 'column')
  }
}

function addTableProperties (descriptor, hotId) {
  let tableProperties = hotStore.state.hotTabs[hotId].tableProperties
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
