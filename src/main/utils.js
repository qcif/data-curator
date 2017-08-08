var ipc = require('electron').ipcMain
var file_formats = require('../renderer/file-actions.js').formats
let path = require('path')

export function createWindow() {
  let mainWindow = new BrowserWindow({width: 800, height: 600})
  console.log('browser window id is: ' + mainWindow.id)

  const winURL = process.env.NODE_ENV === 'development'
    ? `http://localhost:9080`
    : `file://${__dirname}/index.html`
  mainWindow.loadURL(winURL)
  mainWindow.title = 'Untitled.csv'
  mainWindow.format = file_formats.csv
  mainWindow.on('closed', function() {
    mainWindow = null
  })

  mainWindow.on('resize', function() {
    mainWindow.webContents.send('resized')
  })
  return mainWindow
}

export function createWindowTab() {
  console.log('...at initial creating tabs')
  var window = BrowserWindow.getFocusedWindow()
  if (window == null) {
    window = createWindow()
  }
  window.webContents.on('did-finish-load', function() {
    console.log('Initialising tab...')
    window.webContents.send('initTab')
    console.log('Tab initialisation completed.')
  })
}

export function enableSave() {
  var item = Menu.getApplicationMenu().items[1].submenu.items[5]
  item.enabled = true
}
