import {BrowserWindow, Dialog} from 'electron'

var Fs = require('fs')
var ipc = require('electron').ipcMain
var path = require('path')

export function exportdata() {
  var window = BrowserWindow.getFocusedWindow()
  var datapackage = new BrowserWindow({width: 450, height: 600})
  datapackage.loadURL(`http://localhost:9080/#/datapackage`)
  datapackage.setMenu(null)

  datapackage.on('closed', function() {
    datapackage = null
  })

  ipc.once('sendDatapackage', function(e, data, includeHeaders) {
    var currentFileName = window.getTitle()
    var suggestedFileName = path.basename(currentFileName).replace(path.extname(currentFileName), '')

    var thatData = data

    if (includeHeaders === 'true') {
      window.webContents.send('schemaFromHeaders')
      ipc.on('jsonHeaders', function(event, json) {
        datapackageJson(thatData, json, window.format)
      })
    } else {
      datapackageJson(thatData, {}, window.format)
    }

    Dialog.showSaveDialog({
      defaultPath: suggestedFileName + '.zip',
      filters: [
        {
          name: 'text',
          extensions: ['zip']
        }
      ]
    }, function(fileName) {
      if (fileName === undefined) { return }
      datapackage.close()
      window.webContents.send('getCSV', window.format)

      ipc.once('sendCSV', function(e, csv) {
        generateDatapackage(fileName, data, csv, window.format)
      })
    })
  })

  ipc.once('datapackageCanceled', function() {
    datapackage.close()
  })
}

function datapackageJson(dataArg, headers, format) {
  dataArg.keywords = dataArg.keywords.split(',')
  dataArg.resources = [
    {
      'name': dataArg.name,
      'path': 'data/' + dataArg.name + '.' + format.default_extension,
      'mediatype': format.mime_type,
      'schema': headers
    }
  ]
  return dataArg
}

function generateDatapackage(fileName, dataArg, csv, format) {
  var zip = new (require('node-zip'))()
  zip.file('datapackage.json', JSON.stringify(dataArg, null, 2))
  zip.file('data/' + dataArg.name + '.' + format.default_extension, csv)
  var zipData = zip.generate({base64: false, compression: 'DEFLATE'})
  Fs.writeFileSync(fileName, zipData, 'binary')
}

if (process.env.NODE_ENV == 'test') {
  module.exports._private = {
    inputToVocab: datapackageJson,
    zipPackage: generateDatapackage
  }
}
