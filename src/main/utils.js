import {BrowserWindow} from 'electron'

export function createWindowTab() {
  let mainWindow = focusMainWindow()
  if (!mainWindow) {
    mainWindow = createMainWindow()
  }
  mainWindow.webContents.send('addTab')
  return mainWindow
}

export function createMainWindow() {
  const url = process.env.NODE_ENV === 'development'
    ? `http://localhost:9080`
    : `file://${__dirname}/index.html`
  let mainWindow = newWindow('mainWindowId', {width: 800, height: 600, minWidth: 800, minHeight: 600}, url)
  mainWindow.title = 'Data-curator'
  mainWindow.format = fileFormats.csv
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

export function quitOrSaveDialog(event, endButtonName, callback) {
  event.preventDefault()
  let browserWindow = focusMainWindow()
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
    let mainWindow = focusMainWindow()
    await mainWindow.webContents.send('saveData', browserWindow.format, filename)
    callback()
  } catch (err) {
    console.log(err)
  }
}

function closeWindowNoPrompt(result) {
  // let window = BrowserWindow.getFocusedWindow()
  let mainWindow = focusMainWindow()
  if (mainWindow) {
    mainWindow.destroy()
  }
  // ensure any other opened windows are closed
  for (browserWindow of BrowserWindow.getAllWindows) {
    browserWindow.destroy()
  }
  console.log(`closed all windows`)
}

export function createWindowTabWithData(data) {
  let mainWindow = focusMainWindow()
  mainWindow.webContents.send('addTabWithData', data)
}

export function createWindowTabWithFormattedDataFile(data, format, filename) {
  let mainWindow = focusMainWindow()
  mainWindow.webContents.send('addTabWithFormattedDataFile', data, format, filename)
}

export function focusMainWindow() {
  return focusWindow('mainWindowId')
}

export function getExcelWindow() {
  return focusOrNewSecondaryWindow('openexcel', {width: 300, height: 150})
}

export function getKeyboardHelpWindow() {
  return focusOrNewSecondaryWindow('keyboardhelp', {width: 760, height: 400})
}

export function getErrorsWindow() {
  return focusOrNewWindow('errors', {width: 760, height: 400})
}

function focusOrNewSecondaryWindow(id, dimensions) {
  let browserWindow = focusWindow(id)
  if (!browserWindow) {
    browserWindow = newWindow(id, dimensions)
    browserWindow.setMenu(null)
  }
  return browserWindow
}

export function focusWindow(id) {
  let browserWindow = BrowserWindow.fromId(global[id])
  if (browserWindow) {
    if (browserWindow.isMinimized()) {
      browserWindow.restore()
    }
    browserWindow.show()
  }
  return browserWindow
}

export function newWindow(id, dimensions, url) {
  if (process.env.NODE_ENV === 'production' && process.env.BABEL_ENV !== 'test') {
    dimensions.nodeIntegration = false
  }
  console.log(dimensions)
  let browserWindow = new BrowserWindow(dimensions)
  if (!url) {
    url = process.env.NODE_ENV === 'development'
      ? `http://localhost:9080/${id}.html`
      : `file://${__dirname}/${id}.html`
  }
  browserWindow.loadURL(url)
  global[id] = browserWindow.id
  console.log('globals now:')
  console.log(global)
  browserWindow.on('closed', (event) => {
    global[id] = null
    browserWindow = null
  })
  return browserWindow
}
