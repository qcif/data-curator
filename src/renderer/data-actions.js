import store from '@/store'
import fs from 'fs'
import { fixRaggedRows } from '@/ragged-rows.js'
import { includeHeadersInData } from '@/frictionlessUtilities.js'
import { toggleHeaderNoFeedback } from '@/headerRow.js'
import { pushCsvFormat } from '@/dialect.js'
var parse = require('csv-parse/lib/sync')
var stringify = require('csv-stringify/lib/sync')
var CSVSniffer = require('csv-sniffer')()

// { delimiter: ',', lineTerminator, quoteChar, doubleQuote, escapeChar, nullSequence, skipInitialSpace, header, caseSensitiveHeader, csvddfVersion }
const frictionlessToCsvmapper = { delimiter: 'delimiter', lineTerminator: 'rowDelimiter', quoteChar: 'quote', escapeChar: 'escape', skipInitialSpace: 'ltrim' }

export function loadDataIntoHot(hot, data, format) {
  if (_.isArray(data)) {
    loadArrayDataIntoHot(hot, data, format)
  } else {
    loadCsvDataIntoHot(hot, data, format)
  }
}

export function loadCsvDataIntoHot(hot, data, format) {
  // do not handle errors here as caller can activate appropriate user feedback dialog
  let arrays
  // if no format specified, default to csv
  if (typeof format === 'undefined' || !format) {
    arrays = parse(data)
  } else {
    let csvOptions = dialectToCsvOptions(format.dialect)
    // let csv parser handle the line terminators
    _.unset(csvOptions, 'rowDelimiter')
    // if (data.charCodeAt(0) === 0xFEFF) {
    //   store.commit('pushTableProperty', { hotId: hot.guid, key: `bom`, value: 0xFEFF })
    // }
    let sample = _.truncate(data, { length: 1000 })
    var sniffer = new CSVSniffer()

    var sniffResult = sniffer.sniff(sample, { quoteChar: '"' })
    // TODO: update to stream
    console.log('sniff result')
    console.dir(sniffResult)
    arrays = parse(data, csvOptions)
    pushCsvFormat(hot.guid, format)
  }
  fixRaggedRows(arrays)
  hot.loadData(arrays)
  hot.render()
  // frictionless csv header default = true
  toggleHeaderNoFeedback(hot)
}

export function loadArrayDataIntoHot(hot, arrays, format) {
  pushCsvFormat(hot.guid, format)

  fixRaggedRows(arrays)
  hot.loadData(arrays)
  hot.render()
  // frictionless csv header default = true
  toggleHeaderNoFeedback(hot)
}

export function saveDataToFile(hot, format, filename, callback) {
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
  } else {
    let csvOptions = dialectToCsvOptions(format.dialect)
    csvOptions.quoted = true
    data = stringify(arrays, csvOptions)
    pushCsvFormat(hot.guid, format)
  }
  // if (data.charCodeAt(0) !== 0xFEFF && store.getters.getTableProperty({ key: 'bom', hotId: hot.guid })) {
  //   data = String.fromCodePoint(0xFEFF) + data
  // }
  fs.writeFile(filename, data, callback)
}

function dialectToCsvOptions(dialect) {
  let csvOptions = {}
  if (dialect) {
    _.forEach(frictionlessToCsvmapper, function(csvKey, frictionlessKey) {
      if (_.has(dialect, frictionlessKey)) {
        csvOptions[csvKey] = dialect[frictionlessKey]
      }
    })
  }
  return csvOptions
}
