import axios from 'axios'
import fs from 'fs-extra'
import path from 'path'
import {ipcMain as ipc, dialog} from 'electron'
import {focusOrNewSecondaryWindow, focusMainWindow, closeWindowSafely} from './windows'
import {getSubMenuFromMenu, disableAllSubMenuItemsFromMenuObject, enableAllSubMenuItemsFromMenuObject} from './menu.js'
import {Package} from 'datapackage'
import tmp from 'tmp'
import _ from 'lodash'
import {dataResourceToFormat} from '../renderer/file-formats.js'

// auto cleanup
tmp.setGracefulCleanup()

// TODO: handle errors by rejecting promises and throwing back up stack
export function showUrlDialog() {
  // let labels = ['zip from URL....', 'zip from file...', 'json from URL...']
  let menu = getSubMenuFromMenu('File', 'Open Data Package')
  disableAllSubMenuItemsFromMenuObject(menu)
  let browserWindow = focusOrNewSecondaryWindow('urldialog', {width: 300, height: 150, modal: true, alwaysOnTop: true})
  browserWindow.on('closed', () => {
    enableAllSubMenuItemsFromMenuObject(menu)
  })
  browserWindow.webContents.on('did-finish-load', () => {
    ipc.once('urlCancelled', () => {
      closeWindowSafely(browserWindow)
    })
    ipc.once('urlSubmitted', (e, urlText) => {
      closeWindowSafely(browserWindow)
      try {
        handleZipOrJson(urlText)
      } catch (error) {
        console.log(`There was a problem loading package or resource(s)`, error)
        const mainWindow = focusMainWindow()
        mainWindow.webContents.send('closeLoadingScreen')
      }
    })
  })
}

function handleZipOrJson(urlText) {
  if (_.endsWith(urlText, '.json')) {
    loadPackageFromJsonUrl(urlText)
  } else if (_.endsWith(urlText, '.zip')) {
    importDataPackageZipFromUrl(urlText)
  } else {
    showUrlPathNotSupportedMessage()
  }
}

export async function importDataPackageZipFromUrl(urlText) {
  const mainWindow = focusMainWindow()
  mainWindow.webContents.send('closeAndshowLoadingScreen', 'Loading zip URL..')
  try {
    let response = await axios({
      method: 'get',
      url: urlText,
      responseType: 'stream'
    })
    const tmpDir = tmp.dirSync({ mode: '0750', prefix: 'DC_', unsafeCleanup: true })
    const zipDir = tmpDir.name
    // importPackage dependent on creating folder using basename zip
    const basename = path.basename(urlText)
    const zipPath = path.join(zipDir, basename)
    fs.ensureFileSync(zipPath)
    const writable = fs.createWriteStream(zipPath)
    let errors = false
    // close will be called automatically - just need to ensure close on error
    response.data.on('error', (error) => {
      response.data.end()
      writable.end()
      console.log(`Problem with read stream`, error)
      errors = true
    })
    writable.on('error', (error) => {
      response.data.end()
      writable.end()
      console.log(`Problem with write stream`, error)
      errors = true
    })
    await response.data.pipe(writable)
    mainWindow.webContents.send('closeLoadingScreen')
    if (!errors) {
      handleDownloadedZip(zipPath, mainWindow)
    }
  } catch (error) {
    console.log(`Unable to download zip: ${urlText}`, error)
    mainWindow.webContents.send('closeLoadingScreen')
  }
}

function handleDownloadedZip(zipPath, mainWindow) {
  mainWindow.webContents.send('importDataPackage', zipPath, true)
}

async function loadPackageFromJsonUrl(urlText) {
  const mainWindow = focusMainWindow()
  mainWindow.webContents.send('closeAndshowLoadingScreen', 'Loading package URL..')
  const dataPackageJson = await loadPackageJson(urlText, mainWindow)
  if (!dataPackageJson) {
    dialog.showMessageBox(mainWindow, {
      type: 'warning',
      title: `Unable to load Data Package`,
      message:
  `The data package, ${urlText}, could not be loaded.
  If the data package is a URL, please check that the URL exists.`
    })
    mainWindow.webContents.send('closeLoadingScreen')
    return
  }
  if (!dataPackageJson.valid) {
    showInvalidMessage(urlText, mainWindow)
    mainWindow.webContents.send('closeLoadingScreen')
    return
  }
  try {
    await loadResources(dataPackageJson, mainWindow)
  } catch (error) {
    console.log('There was a problem loading package from json', error)
  }
}

function showInvalidMessage(urlText, mainWindow) {
  dialog.showMessageBox(mainWindow, {
    type: 'warning',
    title: `Invalid Data Package`,
    message:
  `The data package, at ${urlText}, is not valid. Please refer to
  https://frictionlessdata.io/specs/
  for more information.`
  })
}

function showUrlPathNotSupportedMessage(urlText, mainWindow) {
  dialog.showMessageBox(mainWindow, {
    type: 'warning',
    title: `Unsupported URL Path extension`,
    message:
  `Data Curator, does not support downloading ${urlText}, as the path does not end in ".zip" or ".json"`
  })
}

// datapackage-js does not support loading url in browser
export async function loadPackageJson(json) {
  try {
    const dataPackage = await Package.load(json)
    return dataPackage
  } catch (error) {
    console.log(`There was a problem loading the package: ${json}`, error)
  }
}

async function loadResources(dataPackageJson, mainWindow) {
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

export async function loadResourceDataFromPackageUrl(url, resourceName) {
  const dataPackage = await loadPackageJson(url)
  const rowOfObjects = []
  if (dataPackage && _.indexOf(dataPackage.resourceNames, resourceName) > -1) {
    // for (const resource of dataPackage.resourceNames) {
    const dataResource = dataPackage.getResource(resourceName)
    console.log(`data resource is`, dataResource)
    const data = await dataResource.read()
    const headers = dataResource.headers
    console.log(`headers are`, headers)
    for (const row of data) {
      rowOfObjects.push(_.zipObject(headers, row))
    }
    console.log(rowOfObjects)
    // }
  }
  return rowOfObjects
}
