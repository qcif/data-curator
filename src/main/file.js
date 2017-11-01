import {enableSave, createWindowTabWithFormattedData} from './utils'
let path = require('path')
const _ = require('lodash')
function makeCustomFormat(separator, delimiter) {
  // assemble a format object describing a custom format
  return {
    label: 'Custom',
    filters: [],
    options: {
      separator: separator,
      delimiter: delimiter
    },
    mime_type: 'text/plain',
    default_extension: 'txt'
  }
}

function openFile(format) {
  Dialog.showOpenDialog({
    filters: format.filters
  }, function(filenames) {
    readFile(filenames, format)
  })
}

function openCustom() {
  // var window = BrowserWindow.getFocusedWindow()
  let dialog = new BrowserWindow({width: 200, height: 400})
  dialog.setMenu(null)
  dialog.once('closed', function() {
    ipc.removeAllListeners('formatSelected')
    dialog = null
  })
  ipc.once('formatSelected', function(event, data) {
    dialog.close()
    var format = makeCustomFormat(data.separator, data.delimiter)
    openFile(format)
  })
  dialog.loadURL(`http://localhost:9080/#/customformat`)
}

function filenameExists(filename) {
  let threshold = global.tab.activeFilename === filename ? 1 : 0
  let length = global.tab.filenames.length
  let filtered = _.without(global.tab.filenames, filename)
  return length - filtered.length > threshold
}

function showExistingFileFeedback(currentWindow) {
  Dialog.showMessageBox(currentWindow, {
    type: 'warning',
    // title is not displayed on screen on macOS
    title: 'Data not saved',
    message: 'The data was not saved to the file.\n\nYou selected a file name that is already used in this Data Package.\n\nTo save the data, choose a unique file name.'
  })
}

function saveFileAs(format, currentWindow) {
  if (!currentWindow) {
    currentWindow = BrowserWindow.getFocusedWindow()
  }
  Dialog.showSaveDialog({
    filters: format.filters,
    defaultPath: global.tab.activeTitle
  }, function(filename) {
    if (filename === undefined) {
      // console.log('returning as no filename was entered...')
      return
    }
    if (filenameExists(filename)) {
      showExistingFileFeedback(currentWindow)
      return
    }
    // enableSave()
    currentWindow.webContents.send('saveData', format, filename)
    currentWindow.format = format
    currentWindow.webContents.send('saveDataSuccess')
  })
}

function saveAsCustom() {
  let currentWindow = BrowserWindow.getFocusedWindow()
  let dialog = new BrowserWindow({width: 200, height: 400})
  dialog.setMenu(null)
  dialog.once('closed', function() {
    ipc.removeAllListeners('formatSelected')
    dialog = null
  })
  ipc.once('formatSelected', function(event, data) {
    dialog.close()
    let format = makeCustomFormat(data.separator, data.delimiter)
    saveFileAs(format, currentWindow)
  })
  dialog.loadURL(`http://localhost:9080/#/customformat`)
}

function saveFile() {
  let currentWindow = BrowserWindow.getFocusedWindow()
  currentWindow.webContents.send('saveData', currentWindow.format, global.tab.activeFilename)
}

function readFile(filenames, format) {
  if (filenames !== undefined) {
    let filename = filenames[0]
    Fs.readFile(filename, 'utf-8', function(err, data) {
      if (err) {
        console.log(err.stack)
      } else {
        createWindowTabWithFormattedDataFile(data, format, filename)
        // enableSave()
      }
    })
  }
}

export {
  openFile,
  openCustom,
  readFile,
  saveFileAs,
  saveAsCustom,
  saveFile
}
