// datapackage-js does not support loading url in browser
import axios from 'axios'
import fs from 'fs-extra'
import path from 'path'
import { dialog, ipcMain as ipc } from 'electron'
import { closeWindowSafely, focusMainWindow, focusOrNewSecondaryWindow } from './windows'
import { disableOpenFileItems, enableOpenFileItems } from './menuUtils.js'
import tmp from 'tmp'
import _ from 'lodash'
import {
  loadDataPackageJsonFromSource,
  loadDataPackageJsonFromSourceWithNoData,
  loadResourceSchemaFromJson
} from './loadFrictionless'

// auto cleanup
tmp.setGracefulCleanup()

const defaultDialogTitle = 'Data Curator - '

export function showUrlDialogForResourceSchema () {
  let browserWindow = createUrlDialogWindow('Open Table Resource Schema URL')
  processUrlDialogForCallback(browserWindow, handleJsonForSchemaHandler(loadResourceSchemaFromJson))
}

export function showUrlDialogForPackageDescriptor () {
  let browserWindow = createUrlDialogWindow('Open Data Package Descriptor URL')
  processUrlDialogForCallback(browserWindow, handleJsonForSchemaHandler(loadDataPackageJsonFromSourceWithNoData))
}

// TODO: handle errors by rejecting promises and throwing back up stack
export function showUrlDialogForPackage () {
  let browserWindow = createUrlDialogWindow('Open Data Package URL')
  processUrlDialogForCallback(browserWindow, handleZipOrJsonForPackage)
}

function createUrlDialogWindow (titleExtension) {
  disableOpenFileItems()
  const fullTitle = titleExtension ? `${defaultDialogTitle} ${titleExtension}` : defaultDialogTitle
  let browserWindow = focusOrNewSecondaryWindow('urldialog', {
    title: fullTitle,
    width: 450,
    height: 150,
    modal: true,
    alwaysOnTop: true
  })
  browserWindow.on('closed', () => {
    enableOpenFileItems()
  })
  return browserWindow
}

export function processUrlDialogForCallback (browserWindow, callback, errorMessage = 'There was a problem loading package or resource(s)', dialogCallbacks) {
  browserWindow.webContents.on('did-finish-load', () => {
    ipc.once('urlCancelled', () => {
      closeWindowSafely(browserWindow)
    })
    ipc.once('urlSubmitted', (e, urlText) => {
      closeWindowSafely(browserWindow)
      try {
        callback(urlText)
      } catch (error) {
        console.error(errorMessage, error)
        const mainWindow = focusMainWindow()
        mainWindow.webContents.send('closeLoadingScreen')
      }
    })
  })
}

function handleZipOrJsonForPackage (urlText) {
  if (_.endsWith(urlText, '.json')) {
    loadDataPackageJsonFromSource(urlText)
  } else if (_.endsWith(urlText, '.zip')) {
    importDataPackageZipFromUrl(urlText)
  } else {
    showUrlPathNotSupportedMessage(urlText, '".json" or ".zip"')
  }
}

function handleJsonForSchemaHandler (schemaHandler) {
  return (urlText) => {
    if (_.endsWith(urlText, '.json')) {
      schemaHandler(urlText)
    } else {
      showUrlPathNotSupportedMessage(urlText, '".json"')
    }
  }
}

export async function importDataPackageZipFromUrl (urlText) {
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
    // close will be called automatically - just need to ensure close on error
    response.data.on('error', (error) => {
      response.data.end()
      writable.end()
      console.error(`Problem with read stream`, error)
    })
    writable.on('error', (error) => {
      response.data.end()
      writable.end()
      console.error(`Problem with write stream`, error)
    })
    // response.data.on('end', () => {
    //   console.log('finished writing response')
    // })
    // do not send file path to renderer until response has completed writing
    writable.on('close', () => {
      mainWindow.webContents.send('closeLoadingScreen')
      handleDownloadedZip(zipPath, mainWindow)
    })
    await response.data.pipe(writable)
  } catch (error) {
    console.error(`Unable to download zip: ${urlText}`, error)
    mainWindow.webContents.send('closeLoadingScreen')
  }
}

function handleDownloadedZip (zipPath, mainWindow) {
  mainWindow.webContents.send('importDataPackageFromFile', zipPath, true)
}

function showUrlPathNotSupportedMessage (urlText, supportedFileExtensions) {
  dialog.showMessageBox(focusMainWindow(), {
    type: 'warning',
    title: `Unsupported URL Path extension`,
    message:
      `Data Curator, does not support downloading ${urlText}, as the path does not end in ${supportedFileExtensions}`
  })
}
