// import axios from 'axios'
import {ipcMain as ipc, dialog} from 'electron'
import {focusOrNewSecondaryWindow, focusMainWindow} from './windows'
import {getSubMenuFromMenu, disableSubMenuItemsFromMenuObject, enableSubMenuItemsFromMenuObject} from './menu.js'
import {Package} from 'datapackage'

export function showUrlDialog() {
  let labels = ['Zip File...', 'URL...']
  let menu = getSubMenuFromMenu('File', 'Open Data Package')
  disableSubMenuItemsFromMenuObject(menu, labels)
  let browserWindow = focusOrNewSecondaryWindow('urldialog', {width: 300, height: 150, modal: true, alwaysOnTop: true})
  browserWindow.on('closed', function () {
    enableSubMenuItemsFromMenuObject(menu, labels)
  })
  browserWindow.webContents.on('did-finish-load', function() {
    ipc.once('urlCancelled', function() {
      if (browserWindow) {
        browserWindow.close()
      }
    })
    ipc.once('urlSubmitted', function(e, urlText) {
      console.log(`text is ${urlText}`)
      if (browserWindow) {
        browserWindow.close()
      }
      const mainWindow = focusMainWindow()
      loadPackageJson(urlText, mainWindow)
      // mainWindow.webContents.send('importDataPackageJsonUrl', urlText)
    })
  })
}

// datapackage-js does not support loading url in browser
async function loadPackageJson(json, mainWindow) {
  try {
    const dataPackage = await Package.load(json)
    console.log(dataPackage)
  } catch (error) {
    // console.log(`There was a problem loading the package: ${json}`, error)
    dialog.showMessageBox(mainWindow, {
      type: 'warning',
      // title is not displayed on screen on macOS
      title: `Unable to load Data Package`,
      message:
`The data package, ${json}, could not be loaded.
If the data package is a URL, please check that the URL exists.`
    })
  }
  return dataPackage
}
