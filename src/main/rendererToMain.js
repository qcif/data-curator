import {ipcMain as ipc} from 'electron'
import {showErrors} from './errors.js'
import {
  getMenu,
  getSubMenuFromMenu,
  clickLabelsOnMenu,
  disableAllSubMenuItemsFromMenuObject,
  enableSubMenuItemsFromMenuObject,
  enableAllSubMenuItemsFromMenuLabel
} from './menu'
import {focusMainWindow, closeSecondaryWindow} from './windows.js'
import {loadPackageJson} from './url.js'

ipc.on('toggleSaveMenu', (event, arg) => {
  let saveSubMenu = getSubMenuFromMenu('File', 'Save')
  let activeFilename = global.tab.activeFilename
  saveSubMenu.enabled = (typeof activeFilename !== 'undefined' && activeFilename.length > 0)
})

ipc.on('hasCaseSensitiveHeader', (event, arg) => {
  let subMenu = getSubMenuFromMenu('Tools', 'Case Sensitive Header Row')
  subMenu.checked = arg
})

ipc.on('hasHeaderRow', (event, arg) => {
  let subMenu = getSubMenuFromMenu('Tools', 'Header Row')
  subMenu.checked = arg
})

ipc.on('showErrorsWindow', (event, arg) => {
  showErrors()
})

ipc.on('clickLabelsOnMenu', (event, arg) => {
  try {
    let returned = clickLabelsOnMenu(arg)
    event.returnValue = returned
  } catch (error) {
    throw (error)
  }
})

ipc.on('focusMainWindow', (event, arg) => {
  focusMainWindow()
})

ipc.on('closeSecondaryWindow', (event, arg) => {
  closeSecondaryWindow(arg)
})

ipc.on('closedFindReplace', (event, arg) => {
  let menu = getMenu('Find')
  disableAllSubMenuItemsFromMenuObject(menu)
  enableSubMenuItemsFromMenuObject(menu, ['Find'])
})

ipc.on('openedFindReplace', (event, arg) => {
  enableAllSubMenuItemsFromMenuLabel('Find')
})

ipc.on('loadPackageUrl', async function(event, index, hotId, url) {
  const mainWindow = focusMainWindow()
  const dataPackage = await loadPackageJson(url)
  if (dataPackage) {
    mainWindow.webContents.send('packageUrlLoaded', index, hotId, url, dataPackage.descriptor)
  }
  // return new Promise((resolve, reject) => {
  // const vueStopLoadingPackageFeedback = this.sendStopLoadingPackageFeedback
  // _.delay(function() {
  //   vueStopLoadingPackageFeedback()
  //   // resolve(true)
  // }, 10000)
  // })
})

function sendStopLoadingPackageFeedback() {
  mainWindow.webContents.send('stopLoadingPackageFeedback')
}
