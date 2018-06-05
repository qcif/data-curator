import {dialog as Dialog, BrowserWindow, ipcMain as ipc} from 'electron'
import Fs from 'fs'
import {enableSave, createWindowTabWithFormattedDataFile, focusMainWindow} from './windows'
import _ from 'lodash'
import {disableOpenFileItems, enableOpenFileItems} from './menuUtils.js'
let path = require('path')

// function makeCustomFormat(separator, delimiter) {
//   // assemble a format object describing a custom format
//   return {
//     label: 'Custom',
//     filters: [],
//     dialect: {
//       delimiter: delimiter,
//       quoteChar: quoteChar
//
//     },
//     mediatype: 'text/plain',
//     format: 'txt'
//   }
// }

// function saveAsCustom() {
//   let currentWindow = focusMainWindow()
//   let dialog
//   if (process.env.BABEL_ENV === 'test' || process.env.NODE_ENV === 'development') {
//     dialog = new BrowserWindow({width: 200, height: 400})
//   } else {
//     dialog = new BrowserWindow({width: 200, height: 400, nodeIntegration: false})
//   }
//   dialog.setMenu(null)
//   dialog.once('closed', function() {
//     ipc.removeAllListeners('formatSelected')
//     dialog = null
//   })
//   ipc.once('formatSelected', function(event, data) {
//     dialog.close()
//     let format = makeCustomFormat(data.delimiter, data.quoteChar)
//     saveFileAs(format, currentWindow)
//   })
//   dialog.loadURL(`http://localhost:9080/#/customformat`)
// }

export function saveFileAs(format) {
  let currentWindow = focusMainWindow()
  Dialog.showSaveDialog({
    filters: format.filters,
    defaultPath: global.tab.activeTitle
  }, function(filename) {
    if (filename === undefined) {
      return
    }
    if (savedFilenameExists(filename)) {
      Dialog.showMessageBox(currentWindow, {
        type: 'warning',
        // title is not displayed on screen on macOS
        title: 'Data not saved',
        message:
`The data was not saved to the file.
You selected a file name that is already used in this Data Package.
To save the data, choose a unique file name.`
      })
      return
    }
    // enableSave()
    currentWindow.webContents.send('saveData', format, filename)
    currentWindow.format = format
    currentWindow.webContents.send('saveDataSuccess')
  })
}

function savedFilenameExists(filename) {
  let threshold = global.tab.activeFilename === filename ? 1 : 0
  let length = global.tab.filenames.length
  let filtered = _.without(global.tab.filenames, filename)
  return length - filtered.length > threshold
}

export function saveFile() {
  let currentWindow = focusMainWindow()
  currentWindow.webContents.send('saveData', currentWindow.format, global.tab.activeFilename)
}

// function openCustom() {
//   // var window = focusMainWindow()
//   let dialog
//   if (process.env.BABEL_ENV === 'test' || process.env.NODE_ENV === 'development') {
//     dialog = new BrowserWindow({width: 200, height: 400})
//   } else {
//     dialog = new BrowserWindow({width: 200, height: 400, nodeIntegration: false})
//   }
//   dialog.setMenu(null)
//   dialog.once('closed', function() {
//     ipc.removeAllListeners('formatSelected')
//     dialog = null
//   })
//   ipc.once('formatSelected', function(event, data) {
//     dialog.close()
//     var format = makeCustomFormat(data.separator, data.delimiter)
//     openFile(format)
//   })
//   dialog.loadURL(`http://localhost:9080/#/customformat`)
// }

export function importDataPackage() {
  disableOpenFileItems()
  let window = focusMainWindow()
  const result = Dialog.showOpenDialog({
    filters: [
      {
        name: '*',
        extensions: ['zip']
      }
    ],
    properties: ['openFile']
  }, function(filename) {
    enableOpenFileItems()
    if (filename === undefined) {
      return
    }
    if (_.isArray(filename)) {
      filename = filename[0]
    }
    window.webContents.send('importDataPackage', filename)
  })
}

export function openFile(format) {
  disableOpenFileItems()
  Dialog.showOpenDialog({
    filters: format.filters
  }, function(filenames) {
    enableOpenFileItems()
    if (process.env.BABEL_ENV === 'test') {
      global.openFileDialogReturned = filenames
    }
    if (filenames === undefined || filenames.length === 0) {
      return
    }
    readFile(filenames[0], format)
  })
}

ipc.on('openFileIntoTab', (event, arg1, arg2) => {
  readFile(arg1, arg2)
})

export function readFile(filename, format) {
  if (openedFilenameExists(filename)) {
    showAlreadyOpenedFileDialog()
    return
  }
  Fs.readFile(filename, 'utf-8', function(err, data) {
    if (err) {
      console.log(err)
    } else {
      createWindowTabWithFormattedDataFile(data, format, filename)
      // enableSave()
    }
  })
}

// TODO: consider toggle global var and use with debounce to check when last dialog triggered so don't get too many dialogs for multiple file opens
function showAlreadyOpenedFileDialog() {
  Dialog.showMessageBox(focusMainWindow(), {
    type: 'warning',
    // title is not displayed on screen on macOS
    title: 'File not opened',
    message: `The file was not opened.
  You selected a file name that is already used in this Data Package.
  A file may only be opened once.`
  })
}

function openedFilenameExists(filename) {
  return _.indexOf(global.tab.filenames, filename) > -1
}
