import { BrowserWindow } from 'electron'
import _ from 'lodash'

export function createWindowTab () {
  let mainWindow = focusMainWindow()
  if (!mainWindow) {
    mainWindow = createMainWindow()
    mainWindow.webContents.on('did-finish-load', function () {
      mainWindow.webContents.send('addTab')
    })
  } else {
    mainWindow.webContents.send('addTab')
  }
  return mainWindow
}

export function createMainWindow () {
  const url = process.env.NODE_ENV === 'development'
    ? `http://localhost:9080`
    : `file://${__dirname}/index.html`
  let mainWindow = newWindow('home', { width: 800, height: 600, minWidth: 800, minHeight: 600 }, url)
  mainWindow.on('resize', function () {
    // TODO : replace with debounce
    if (global.resizeTimerId) {
      clearTimeout(global.resizeTimerId)
    }
    let timerId = setTimeout(function () {
      mainWindow.webContents.send('resized')
    }, 250)
    global.resizeTimerId = timerId
  })
  return mainWindow
}

export function createWindowTabWithData (data) {
  let mainWindow = focusMainWindow()
  mainWindow.webContents.send('addTabWithData', data)
}

export function createWindowTabWithFormattedDataFile (data, format, filename) {
  let mainWindow = focusMainWindow()
  mainWindow.webContents.send('addTabWithFormattedDataFile', data, format, filename)
}

export function closeSecondaryWindow (windowName) {
  let browserWindow = focusWindow(windowName)
  closeWindowSafely(browserWindow)
  focusMainWindow()
}

export function focusMainWindow () {
  return focusWindow('home')
}

export function focusOrNewSecondaryWindow (id, config) {
  let browserWindow = focusWindow(id)
  if (!browserWindow) {
    browserWindow = newWindow(id, config)
    browserWindow.removeMenu()
  }
  return browserWindow
}

export function focusWindow (id) {
  let browserWindow
  if (global.windows[id]) {
    browserWindow = BrowserWindow.fromId(global.windows[id])
  }
  if (browserWindow) {
    if (browserWindow.isMinimized()) {
      browserWindow.restore()
    }
    browserWindow.show()
  }
  return browserWindow
}

export function newWindow (id, config, url) {
  _.set(config, 'webPreferences.enableRemoteModule', true)
  _.set(config, 'webPreferences.nodeIntegration', true)
  _.set(config, 'webPreferences.contextIsolation', false)
  let browserWindow = new BrowserWindow(config)
  if (!url) {
    url = process.env.NODE_ENV === 'development'
      ? `http://localhost:9080/${id}.html`
      : `file://${__dirname}/${id}.html`
  }
  browserWindow.loadURL(url)
  global.windows[id] = browserWindow.id
  browserWindow.on('closed', (event) => {
    global.windows[id] = null
    browserWindow = null
  })
  return browserWindow
}

export function closeWindowSafely (browserWindow) {
  if (browserWindow && !browserWindow.isDestroyed()) {
    browserWindow.close()
  }
}
