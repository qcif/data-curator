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
  var dialog = new BrowserWindow({width: 200, height: 400})
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
  let threshold = global.tab.activeFilename ? 1 : 0
  console.log(`threshold is: ${threshold}`)
  let length = global.tab.filenames.length
  let filtered = _.without(global.tab.filenames, filename)
  return length - filtered.length > threshold
}

function saveFileAs(format, window) {
  if (!window) {
    window = BrowserWindow.getFocusedWindow()
  }
  Dialog.showSaveDialog({
    filters: format.filters,
    defaultPath: global.tab.activeTitle
  }, function(filename) {
    if (filename === undefined) {
      console.log('returning as no filename was entered...')
      return
    }
    if (filenameExists(filename)) {
      console.log('returning as filename exists...')
      Dialog.showMessageBox(window, {
        type: 'warning',
        title: 'Save failed',
        message: 'Filename already exists. Please try again.'
      })
      return
    }

    // enableSave()
    window.webContents.send('saveData', format, filename)
    window.format = format
    window.webContents.send('saveDataSuccess')
  })
}

function saveAsCustom() {
  var window = BrowserWindow.getFocusedWindow()
  var dialog = new BrowserWindow({width: 200, height: 400})
  dialog.once('closed', function() {
    ipc.removeAllListeners('formatSelected')
    dialog = null
  })
  ipc.once('formatSelected', function(event, data) {
    dialog.close()
    var format = makeCustomFormat(data.separator, data.delimiter)
    saveFileAs(format, window)
  })
  dialog.loadURL(`http://localhost:9080/#/customformat`)
}

function saveFile() {
  var window = BrowserWindow.getFocusedWindow()
  window.webContents.send('saveData', window.format)
}

function readFile(filenames, format) {
  if (filenames === undefined) {

  } else {
    var filename = filenames[0]
    Fs.readFile(filename, 'utf-8', function(err, data) {
      if (err) {
        console.log(err.stack)
      }
      createWindowTabWithFormattedData(data, format)
      // enableSave()
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
