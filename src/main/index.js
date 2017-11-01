/**
 * Set `__static` path to static files in production
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-static-assets.html
 */
import {dialog, app} from 'electron'
import {quitOrSaveDialog} from './utils'
import {readFile} from './file.js'
import {menu as template} from './menu'

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
global.electron = require('electron')

// global.app = electron.app
global.request = electron.request
global.BrowserWindow = electron.BrowserWindow
global.Menu = electron.Menu
global.Dialog = electron.dialog

global.Fs = require('fs')
// global.XLSX = require('xlsx')
global.ipc = require('electron').ipcMain

global.utils = require('./utils')
global.datapackage = require('./datapackage')
global.github = require('./github')
global.schema = require('./schema')
global.excel = require('./excel')
// global.fileActions = require('./file')
global.tools = require('./tools')
global.help = require('./help')

// var mainWindow = null
function createWindow() {
  var menu = Menu.buildFromTemplate(template)
  Menu.setApplicationMenu(menu)

  var filename = clFilename
  if (filename) {
    readFile([filename])
  } else {
    global.utils.createWindowTab()
  }
}

// function checkForMultipleWindows() {
//   console.log('checking for multiple windows...')
// }

const isSecondInstance = app.makeSingleInstance((commandLine, workingDirectory) => {
// Someone tried to run a second instance, we should focus our window.
  console.log('Attempted to open a second instance. Disallowing...')
  let firstWindow = BrowserWindow.getAllWindows()[0]
  if (firstWindow) {
    if (firstWindow.isMinimized()) firstWindow.restore()
    firstWindow.focus()
  }
})

if (isSecondInstance) {
  console.log('Data curator is already open. Quitting this application.')
  app.quit()
}

// app.on('activate', checkForMultipleWindows)

app.on('ready', createWindow)

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
