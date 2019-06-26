import store from '@/store'
import fs from 'fs'
import { fixRaggedRows } from '@/ragged-rows.js'
import { includeHeadersInData } from '@/frictionlessUtilities.js'
import { toggleHeaderNoFeedback } from '@/headerRow.js'
import { pushCsvFormat } from '@/dialect.js'
import detectNewline from 'detect-newline'

var parse = require('csv-parse/lib/sync')
var stringify = require('csv-stringify/lib/sync')
var CSVSniffer = require('csv-sniffer')()

// { delimiter: ',', lineTerminator, quoteChar, doubleQuote, escapeChar, nullSequence, skipInitialSpace, header, caseSensitiveHeader, csvddfVersion }
const frictionlessToCsvmapper = {
  delimiter: 'delimiter',
  lineTerminator: 'rowDelimiter',
  quoteChar: 'quote',
  escapeChar: 'escape',
  skipInitialSpace: 'ltrim'
}

export function loadDataIntoHot (hot, data, format) {
  if (_.isArray(data)) {
    loadArrayDataIntoHot(hot, data, format)
  } else {
    loadCsvDataIntoHot(hot, data, format)
  }
}

export function loadCsvDataIntoHot (hot, data, format) {
  // do not handle errors here as caller can activate appropriate user feedback dialog
  let arrays
  // if no format specified, default to csv
  if (typeof format === 'undefined' || !format) {
    detectAndStoreQuoteChar(data, { rowDelimiter: '\n' }, hot.guid)
    arrays = parse(data)
  } else {
    let csvOptions = dialectToCsvOptions(format.dialect)
    detectAndStoreQuoteChar(data, csvOptions, hot.guid)
    // let csv parser handle the line terminators
    _.unset(csvOptions, 'rowDelimiter')
    // TODO: update to stream
    csvOptions.bom = false
    if (data.charCodeAt(0) === 0xFEFF) {
      store.commit('pushTableProperty', { hotId: hot.guid, key: `bom`, value: 0xFEFF })
    }
    console.dir(store)
    let hexdump = require('hexdump-nodejs')
    let buffer = Buffer.from(data)
    // buffer.write(data, 0x10)
    console.log('data before parse...')
    console.log(hexdump(buffer))
    arrays = parse(data, csvOptions)
    if (arrays[1] && arrays[1][0]) {
      buffer = Buffer.from(arrays[1][0])
      // buffer2.write(arrays[0], 0x10)
      console.log('array 0 after parse...')
      console.log(hexdump(buffer))
    }
    pushCsvFormat(hot.guid, format)
  }
  fixRaggedRows(arrays)
  hot.loadData(arrays)
  hot.render()
  // frictionless csv header default = true
  toggleHeaderNoFeedback(hot)
}

export function loadArrayDataIntoHot (hot, arrays, format) {
  pushCsvFormat(hot.guid, format)

  fixRaggedRows(arrays)
  hot.loadData(arrays)
  hot.render()
  // frictionless csv header default = true
  toggleHeaderNoFeedback(hot)
}

export function saveDataToFile (hot, format, filename, callback) {
  let tabId = store.getters.getActiveTab
  if (typeof filename === 'string') {
    store.commit('pushTabObject', { id: tabId, filename: filename })
  } else {
    filename = store.getters.getTabObjects(`${tabId}.filename`)
  }
  if (!filename) {
    return
  }
  if (typeof callback === 'undefined') {
    callback = (err) => {
      if (err) {
        console.error('There was a problem saving data to file.')
        throw err
      }
      // console.log('File saved successfully.')
    }
  }

  // unlike handsontable, in frictionless by default, headers should be included (http://frictionlessdata.io/specs/csv-dialect)
  let arrays = includeHeadersInData(hot)
  let data
  // if no format specified, default to csv
  if (typeof format === 'undefined' || !format) {
    // TODO: update to stream
    data = stringify(arrays)
    let hexdump = require('hexdump-nodejs')
    let buffer = Buffer.from(data)
    // buffer.write(data, 0x10)
    console.log('data after stringify...')
    console.log(hexdump(buffer))
  } else {
    let csvOptions = dialectToCsvOptions(format.dialect)
    if (store.getters.getTableProperty({ key: 'sampledQuoteChar', hotId: hot.guid })) {
      csvOptions.quoted = true
    }
    data = stringify(arrays, csvOptions)
    let hexdump = require('hexdump-nodejs')
    let buffer = Buffer.from(data)
    // buffer.write(data, 0x10)
    console.log('data after stringify...')
    console.log(hexdump(buffer))
    pushCsvFormat(hot.guid, format)
  }
  if (data.charCodeAt(0) !== 0xFEFF && store.getters.getTableProperty({ key: 'bom', hotId: hot.guid })) {
    data = String.fromCodePoint(0xFEFF) + data
  }
  fs.writeFile(filename, data, callback)
}

function dialectToCsvOptions (dialect) {
  let csvOptions = {}
  if (dialect) {
    _.forEach(frictionlessToCsvmapper, function (csvKey, frictionlessKey) {
      if (_.has(dialect, frictionlessKey)) {
        csvOptions[csvKey] = dialect[frictionlessKey]
      }
    })
  }
  return csvOptions
}

function detectAndStoreQuoteChar (data, csvOptions, hotId) {
  let sample = _.truncate(data, { length: 2000 })
  var sniffer = new CSVSniffer()
  // csv-sniffer will throw exception if there is no line terminator in sample
  let newLineString = detectNewline(sample) || csvOptions.rowDelimiter
  var sniffResult = sniffer.sniff(sample, { newlineStr: newLineString })
  if (sniffResult.quoteChar) {
    store.commit('pushTableProperty', { hotId: hotId, key: `sampledQuoteChar`, value: sniffResult.quoteChar })
  }
}
