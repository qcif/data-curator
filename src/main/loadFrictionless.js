// datapackage-js does not support loading url in browser
// atm, 'types' are only : Data Package or Resource Schema
import { focusMainWindow } from './windows'
import _ from 'lodash'
import { dataResourceToFormat } from '../renderer/file-formats'
import { dialog } from 'electron'
import { Package } from 'datapackage'
import { Schema } from 'tableschema'

export async function loadPackageFromJson (json) {
  const mainWindow = focusMainWindow()
  const dataPackageJson = await loadGenericFrictionlessFromJsonSource(json, loadPackageJson, 'Data Package')
  try {
    await loadResources(dataPackageJson, mainWindow)
  } catch (error) {
    console.error('There was a problem loading package from json', error)
  }
}

export async function loadResourceSchemaFromJson (json) {
  try {
    const resourceSchema = await loadGenericFrictionlessFromJsonSource(json, loadTableResourceSchemaJson, 'Table Resource Schema')
    const mainWindow = focusMainWindow()
    mainWindow.webContents.send('closeLoadingScreen')
    if (resourceSchema && resourceSchema.descriptor) {
      const mainWindow = focusMainWindow()
      mainWindow.webContents.send('addSchemaToTabAndLock', resourceSchema.descriptor)
    }
  } catch (error) {
    console.error('There was a problem loading resource schema from json', error)
  }
}

async function loadGenericFrictionlessFromJsonSource (jsonSource, callback, frictionlessType) {
  const mainWindow = focusMainWindow()
  mainWindow.webContents.send('closeAndshowLoadingScreen', `Loading ${frictionlessType}..`)
  const frictionlessTypeJson = await callback(jsonSource, mainWindow)
  if (!frictionlessTypeJson) {
    dialog.showMessageBox(mainWindow, {
      type: 'warning',
      title: `Unable to load ${frictionlessType}`,
      message:
        `The ${frictionlessType}, ${jsonSource}, could not be loaded.
  If the ${frictionlessType} is a URL or file, please check that it exists in JSON format.`
    })
    mainWindow.webContents.send('closeLoadingScreen')
    return
  }
  if (!frictionlessTypeJson.valid) {
    showInvalidMessage(jsonSource, mainWindow, frictionlessType)
    mainWindow.webContents.send('closeLoadingScreen')
    return
  }
  return frictionlessTypeJson
}

function showInvalidMessage (source, mainWindow, frictionlessType) {
  dialog.showMessageBox(mainWindow, {
    type: 'warning',
    title: `Invalid ${frictionlessType}`,
    message:
      `The ${frictionlessType}, at ${source}, is not valid. Please refer to
  https://frictionlessdata.io/specs/
  for more information.`
  })
}

export async function loadPackageJson (source) {
  try {
    const dataPackage = await Package.load(source)
    return dataPackage
  } catch (error) {
    console.error(`There was a problem loading the package: ${source}`, error)
  }
}

async function loadResources (dataPackageJson) {
  const mainWindow = focusMainWindow()
  let packageProperties = _.assign({}, dataPackageJson.descriptor)
  _.unset(packageProperties, 'resources')
  mainWindow.webContents.send('resetPackagePropertiesToObject', packageProperties)
  for (const resource of dataPackageJson.resourceNames) {
    mainWindow.webContents.send('closeAndshowLoadingScreen', 'Loading next resource...')
    const dataResource = dataPackageJson.getResource(resource)
    const format = dataResourceToFormat(dataResource.descriptor)
    let data = await dataResource.read()
    mainWindow.webContents.send('closeLoadingScreen')
    // datapackage-js separates headers - add back to use default DC behaviour
    let dataWithHeaders = _.concat([dataResource.headers], data)
    mainWindow.webContents.send('addTabWithFormattedDataAndDescriptor', dataWithHeaders, format, dataResource.descriptor)
  }
}

async function loadTableResourceSchemaJson (source) {
  try {
    const resourceSchema = await Schema.load(source)
    return resourceSchema
  } catch (error) {
    console.error(`There was a problem loading the table resource schema: ${source}`, error)
  }
}

export async function loadResourceDataFromPackageSource (source, resourceName) {
  const dataPackage = await loadPackageJson(source)
  const rowOfObjects = []
  if (dataPackage && _.indexOf(dataPackage.resourceNames, resourceName) > -1) {
    const dataResource = dataPackage.getResource(resourceName)
    const data = await dataResource.read()
    const headers = dataResource.headers
    for (const row of data) {
      rowOfObjects.push(_.zipObject(headers, row))
    }
  }
  return rowOfObjects
}
