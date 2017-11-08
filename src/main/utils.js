import {dialog, ipcMain as ipc, BrowserWindow, Menu} from 'electron'
import {fileFormats} from '../renderer/file-formats.js'
let path = require('path')

export function createWindow() {
  let mainWindow = new BrowserWindow({width: 800, height: 600, minWidth: 800, minHeight: 600})

  const winURL = process.env.NODE_ENV === 'development'
    ? `http://localhost:9080`
    : `file://${__dirname}/index.html`
  mainWindow.loadURL(winURL)
  mainWindow.title = 'Data-curator'
  mainWindow.format = fileFormats.csv
  mainWindow.on('closed', function() {
    mainWindow = null
  })

  mainWindow.on('resize', function() {
    // TODO : replace with debounce
    if (global.resizeTimerId) {
      clearTimeout(global.resizeTimerId)
    }
    let timerId = setTimeout(function() {
      mainWindow.webContents.send('resized')
    }, 250)
    global.resizeTimerId = timerId
  })

  if (process.env.NODE_ENV === 'production') {
    mainWindow.on('close', (event) => {
      quitOrSaveDialog(event, 'Close All', closeWindowNoPrompt)
    })
  }

  return mainWindow
}

function closeWindowNoPrompt(result) {
  let browserWindow = BrowserWindow.getAllWindows()[0]
  browserWindow.destroy()
}

export function createWindowTab() {
  let window = BrowserWindow.getFocusedWindow()
  if (window == null) {
    window = createWindow()
  } else {
    window.webContents.send('addTab')
  }
}

export function createWindowTabWithData(data) {
  let window = BrowserWindow.getFocusedWindow()
  if (window == null) {
    window = createWindow()
  } else {
    window.webContents.send('addTabWithData', data)
  }
}

export function createWindowTabWithFormattedDataFile(data, format, filename) {
  let window = BrowserWindow.getFocusedWindow()
  if (window == null) {
    window = createWindow()
  } else {
    window.webContents.send('addTabWithFormattedDataFile', data, format, filename)
  }
}

export function showSidePanel(name) {
  let window = BrowserWindow.getFocusedWindow()
  window.webContents.send('showSidePanel', name)
}

export function guessColumnProperties() {
  let window = BrowserWindow.getFocusedWindow()
  window.webContents.send('guessColumnProperties')
}

export function validateTable() {
  let window = BrowserWindow.getFocusedWindow()
  window.webContents.send('validateTable')
}

function getSaveSubMenu() {
  let fileMenu = Menu.getApplicationMenu().items.find(x => x.label === 'File')
  let saveSubMenu = fileMenu.submenu.items.find(x => x.label === 'Save')
  return saveSubMenu
}

ipc.on('toggleSaveMenu', (event, arg) => {
  toggleSaveMenu()
})

export function toggleSaveMenu() {
  let saveSubMenu = getSaveSubMenu()
  let activeFilename = global.tab.activeFilename
  saveSubMenu.enabled = (typeof activeFilename !== 'undefined' && activeFilename.length > 0)
}

async function saveAndExit(callback, filename) {
  try {
    let browserWindow = BrowserWindow.getAllWindows()[0]
    await browserWindow.webContents.send('saveData', browserWindow.format, filename)
    callback()
  } catch (err) {
    console.log(err)
  }
}

export function quitOrSaveDialog(event, endButtonName, callback) {
  event.preventDefault()
  let browserWindow = BrowserWindow.getFocusedWindow()
  dialog.showMessageBox(browserWindow, {
    type: 'warning',
    buttons: [
      'Cancel', endButtonName, 'Save'
    ],
    defaultId: 0,
    title: 'Save current tab before close?',
    message: 'Save current tab before close?'
  }, function(response) {
    if (response === 0) {
      return
    }
    if (response === 1) {
      callback()
    } else {
      dialog.showSaveDialog({}, function(filename) {
        if (filename === undefined) {
          return
        }
        saveAndExit(callback, filename)
      })
    }
  })
}
