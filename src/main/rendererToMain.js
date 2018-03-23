import {ipcMain as ipc} from 'electron'
import {showErrors} from './errors.js'
import {getSubMenuFromMenu, clickLabelsOnMenu} from './menu'
import {focusMainWindow} from './windows.js'

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
