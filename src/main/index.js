/**
 * Set `__static` path to static files in production
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-static-assets.html
 */
if (process.env.NODE_ENV !== 'development') {
  global.__static = require('path').join(__dirname, '/static').replace(/\\/g, '\\\\')
}

global.electron = require('electron')

global.app = electron.app
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
global.fileActions = require('./file')
global.tools = require('./tools')
global.validate = require('./validate')
global.help = require('./help')

var template = require('./menu').menu
var mainWindow = null
function createWindow() {
  var menu = Menu.buildFromTemplate(template)
  Menu.setApplicationMenu(menu)

  var filename = clFilename
  if (filename) {
    fileActions.readFile([filename])
  } else {
    global.utils.createWindow()
  }
}

app.on('ready', createWindow)

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
