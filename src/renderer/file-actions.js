import store from '../renderer/store/modules/hots.js'
const fs = require('fs')
const $ = global.jQuery = require('jquery/dist/jquery.js')
require('jquery-csv/src/jquery.csv.js')

/**
 * Definitions for supported file types
 *
 * Add more objects here to support additional formats
 */
var formats = {
  csv: {
    label: 'Comma separated',
    filters: [
      {
        name: 'csv files',
        extensions: ['csv']
      }
    ],
    options: {
      separator: ',',
      delimiter: '"'
    },
    mime_type: 'text/csv',
    default_extension: 'csv'
  },
  tsv: {
    label: 'Tab separated',
    filters: [
      {
        name: 'tsv files',
        extensions: ['tsv']
      }, {
        name: 'txt files',
        extensions: ['txt']
      }, {
        name: 'dat files',
        extensions: ['dat']
      }
    ],
    options: {
      separator: '\t',
      delimiter: '"'
    },
    mime_type: 'text/tab-separated-values',
    default_extension: 'tsv'
  },
  semicolon: {
    label: 'Semicolon separated',
    filters: [
      {
        name: 'csv files',
        extensions: ['csv']
      }
    ],
    options: {
      separator: ';',
      delimiter: '"'
    },
    mime_type: 'text/csv',
    default_extension: 'csv'
  }
}

var openFile = function(hot, data, format) {
  var arrays
  // if no format specified, default to csv
  if (typeof format === 'undefined') {
    arrays = $.csv.toArrays(data)
  } else {
    arrays = $.csv.toArrays(data, format.options)
  }
  hot.loadData(arrays)
  return arrays
}

var saveFile = function(hot, format, filename, callback) {
  console.log('saving')
  var data
  if (typeof filename !== 'string') {
    console.dir(store.state.hotTabs)
    console.dir(`hot guid is: ${hot.guid}`)
    let defaultQualifier = _.get(store.state.hotTabs, `${hot.guid}.tabId`, '')
    filename = _.get(store.state.hotTabs, `${hot.guid}.title`, `Untitled${defaultQualifier}.csv`)
    console.dir(`${filename}`)
  }
  store.mutations.pushHotTab(store.state, {'hotId': hot.guid, 'title': filename})
  console.dir(store.state.hotTabs)
  // if no format specified, default to csv
  if (typeof format === 'undefined') {
    data = $.csv.fromArrays(hot.getData())
  } else {
    data = $.csv.fromArrays(hot.getData(), format.options)
  }
  if (typeof callback === 'undefined') {
    fs.writeFile(filename, data, function(err) {
      if (err) {
        console.log(err.stack)
      }
    })
  } else {
    fs.writeFile(filename, data, callback)
  }
  document.title = filename
}

export {
  formats,
  openFile as open,
  saveFile as save
}
