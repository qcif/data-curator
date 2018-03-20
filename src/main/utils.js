import {dialog, BrowserWindow} from 'electron'
import {fileFormats} from '../renderer/file-formats.js'
import _ from 'lodash'

export function createWindow() {
  let mainWindow = getMainWindow()

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
  let browserWindow = getMainWindow()
  if (browserWindow) {
    browserWindow.destroy()
  }
}

export function createWindowTab() {
  let window = getMainWindow()
  if (window == null) {
    window = createWindow()
  } else {
    window.webContents.send('addTab')
  }
}

export function createWindowTabWithData(data) {
  let window = getMainWindow()
  if (window == null) {
    window = createWindow()
  } else {
    window.webContents.send('addTabWithData', data)
  }
}

export function createWindowTabWithFormattedDataFile(data, format, filename) {
  let window = getMainWindow()
  if (window == null) {
    window = createWindow()
  } else {
    window.webContents.send('addTabWithFormattedDataFile', data, format, filename)
  }
}

export function quitOrSaveDialog(event, endButtonName, callback) {
  event.preventDefault()
  let browserWindow = getMainWindow()
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

async function saveAndExit(callback, filename) {
  try {
    let browserWindow = getMainWindow()
    await browserWindow.webContents.send('saveData', browserWindow.format, filename)
    callback()
  } catch (err) {
    console.log(err)
  }
}

export function getMainWindow() {
  return focusOrNewWindow(global.mainWindowId, {width: 800, height: 600, minWidth: 800, minHeight: 600})
}

export function getExcelWindow() {
  return focusOrNewWindow(global.excelWindowId, {width: 300, height: 150})
}

export function getKeyboardHelpWindow() {
  return focusOrNewWindow(global.keyboardHelpWindowId, {width: 760, height: 400})
}

export function getErrorsWindow() {
  return focusOrNewWindow(global.keyboardHelpWindowId, {width: 760, height: 400})
}

function focusOrNewWindow(id, dimensions) {
  console.log(`id is ${id}`)
  if (typeof id !== 'undefined') {
    return focusWindow(id)
  } else {
    console.log(`grabbing new window`)
    return newWindow(dimensions)
  }
}

export function focusWindow(id) {
  let browserWindow = BrowserWindow.fromId(id)
  if (browserWindow) {
    if (browserWindow.isMinimized()) {
      browserWindow.restore()
    }
    browserWindow.show()
  }
  return browserWindow
}

export function newWindow(dimensions) {
  if (process.env.BABEL_ENV !== 'test') {
    _.assign(dimensions, {nodeIntegration: false})
  }
  console.log(dimensions)
  return new BrowserWindow(dimensions)
}
