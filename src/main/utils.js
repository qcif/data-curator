var ipc = require('electron').ipcMain
var file_formats = require('../renderer/file-actions.js').formats
let path = require('path')

export function createWindow() {
  let mainWindow = new BrowserWindow({width: 800, height: 600})

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
    window.webContents.send('initTab')
  })
}

export function enableSave() {
  var item = Menu.getApplicationMenu().items[1].submenu.items[5]
  item.enabled = true
}
