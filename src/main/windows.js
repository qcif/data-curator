import {BrowserWindow} from 'electron'
import {fileFormats} from '../renderer/file-formats.js'

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
  let mainWindow = newWindow('home', {width: 800, height: 600, minWidth: 800, minHeight: 600}, url)
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
  return mainWindow
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
  return focusWindow('home')
}

export function focusOrNewSecondaryWindow(id, dimensions) {
  let browserWindow = focusWindow(id)
  if (!browserWindow) {
    browserWindow = newWindow(id, dimensions)
    browserWindow.setMenu(null)
  }
  return browserWindow
}

export function focusWindow(id) {
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

export function newWindow(id, dimensions, url) {
  if (process.env.NODE_ENV === 'production' && process.env.BABEL_ENV !== 'test') {
    dimensions.nodeIntegration = false
  }
  let browserWindow = new BrowserWindow(dimensions)
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
