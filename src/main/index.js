/**
 * Set `__static` path to static files in production
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-static-assets.html
 */
import {app, Menu, BrowserWindow} from 'electron'
import {quitOrSaveDialog, createWindowTab} from './utils'
import {readFile} from './file.js'
import {menu as template} from './menu'
require('./rendererToMenu.js')

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

// var mainWindow = null
function createWindow() {
  var menu = Menu.buildFromTemplate(template)
  Menu.setApplicationMenu(menu)

  var filename = clFilename
  if (filename) {
    readFile([filename])
  } else {
    createWindowTab()
  }
}

const isSecondInstance = app.makeSingleInstance((commandLine, workingDirectory) => {
  // Someone tried to run a second instance, we should focus our window.
  console.log('Attempted to open a second instance. Disallowing...')
  let firstWindow = BrowserWindow.getAllWindows()[0]
  if (firstWindow) {
    if (firstWindow.isMinimized()) { firstWindow.restore() }
    firstWindow.focus()
  }
})

if (isSecondInstance) {
  console.log('Data curator is already open. Quitting this application.')
  app.quit()
}

// app.on('activate', checkForMultipleWindows)

app.on('ready', () => {
  createWindow()
  let id = BrowserWindow.getAllWindows()[0].id
  global.mainWindowId = id
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
