import { ipcMain as ipc, dialog, Menu } from 'electron'
import { showErrors } from './errors.js'
import {
  getMenu,
  getSubMenuFromMenu,
  clickLabelsOnMenu,
  disableAllSubMenuItemsFromMenuObject,
  enableSubMenuItemsFromMenuObject,
  enableAllSubMenuItemsFromMenuLabel,
  disableEnableBasedOnAttributeAndConditionFromLabels
} from './menuUtils.js'
import { focusMainWindow, closeSecondaryWindow } from './windows.js'
import { loadPackageJson, loadResourceDataFromPackageSource } from './loadFrictionless'

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

ipc.on('hasLockedActiveTable', (event, arg) => {
  let lockedSubMenu = getSubMenuFromMenu('Tools', 'Lock Table Schema')
  lockedSubMenu.checked = arg
  // for locked table (ie: lock is enabled), value is true, so any menu 'enabled': set to false
  disableEnableBasedOnAttributeAndConditionFromLabels(['Edit', 'Tools'], 'lockable', !arg)
})

ipc.on('showErrorsWindow', (event, arg) => {
  showErrors()
})

ipc.on('clickLabelsOnMenu', (event, arg) => {
  try {
    let returned = clickLabelsOnMenu(arg)
    if (returned) {
      event.returnValue = returned
    }
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
})

ipc.on('loadPackageUrlResourcesAsFkRelations', async function(event, url, resourceName) {
  try {
    const rows = await loadResourceDataFromPackageSource(url, resourceName)
    event.returnValue = rows
  } catch (error) {
    const errorMessage = 'There was a problem collating data from url resources'
    const mainWindow = focusMainWindow()
    dialog.showMessageBox(mainWindow, {
      type: 'error',
      title: 'Problem loading data package url',
      message: errorMessage
    })
    console.error(errorMessage, error)
  }
})

ipc.on('loadingScreenTimeout', (event, arg) => {
  const mainWindow = focusMainWindow()
  const message = arg || 'There was a problem with loading. There could a problem with the source.'
  dialog.showMessageBox(mainWindow, {
    type: 'error',
    title: `Loading Timeout`,
    message: message
  })
})

ipc.on('dataParsingError', (event, arg) => {
  const mainWindow = focusMainWindow()
  const message = arg || 'Unable to parse data. There could be a problem with the data format.'
  dialog.showMessageBox(mainWindow, {
    type: 'error',
    title: `Data parsing Error`,
    message: message
  })
})
