/**
 * Set `__static` path to static files in production
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-static-assets.html
 */
import {app, Menu, BrowserWindow, ipcMain as ipc, dialog} from 'electron'
import {createWindowTab, quitOrSaveDialog, getErrorsWindow} from './utils'
import {template, getSubMenuFromMenu, clickLabelsOnMenu} from './menu'
import {fileFormats} from '../renderer/file-formats.js'

if (process.env.NODE_ENV !== 'development') {
  global.__static = require('path').join(__dirname, '/static').replace(/\\/g, '\\\\')
  global.version = app.getVersion()
} else {
  global.version = require('../../package.json').version
}

global.tab = {
  activeTitle: '',
  activeFilename: '',
  filenames: []
}

const isSecondInstance = app.makeSingleInstance((commandLine, workingDirectory) => {
  // Someone tried to run a second instance, we should focus our window.
  console.log('Attempted to open a second instance. Disallowing...')
  focusMainWindow()
})

if (isSecondInstance) {
  console.log('Data curator is already open. Quitting this application.')
  app.quit()
}

// app.on('activate', checkForMultipleWindows)

app.on('ready', () => {
  var menu = Menu.buildFromTemplate(template)
  Menu.setApplicationMenu(menu)
  let browserWindow = createWindowTab()
})

function closeAppNoPrompt() {
  app.exit()
}

if (process.env.NODE_ENV === 'production') {
  app.on('before-quit', (event) => {
    quitOrSaveDialog(event, 'Quit', closeAppNoPrompt)
  })
}

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

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
  getErrorsWindow()
})

ipc.on('clickLabelsOnMenu', function(event, args) {
  try {
    let returned = clickLabelsOnMenu(args)
    event.returnValue = returned
  } catch (error) {
    throw (error)
  }
})

/**
 * Auto Updater
 *
 * Uncomment the following code below and install `electron-updater` to
 * support auto updating. Code Signing with a valid certificate is required.
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-electron-builder.html#auto-updating
 */

/*
import { autoUpdater } from 'electron-updater'

autoUpdater.on('update-downloaded', () => {
  autoUpdater.quitAndInstall()
})

app.on('ready', () => {
  if (process.env.NODE_ENV === 'production') autoUpdater.checkForUpdates()
})
 */
