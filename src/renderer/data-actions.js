import tabStore from '../renderer/store/modules/tabs.js'
import fs from 'fs'
import {fixRaggedRows} from '@/ragged-rows.js'
import {includeHeadersInData} from '@/frictionlessUtilities.js'
import {toggleHeaderNoFeedback} from '@/headerRow.js'
// import parse from 'csv-parse/lib/sync'
// import stringify from 'csv-stringify'
const $ = global.jQuery = require('jquery/dist/jquery.js')
require('jquery-csv/src/jquery.csv.js')

export function loadDataIntoHot(hot, data, format) {
  let arrays
  // if no format specified, default to csv
  if (typeof format === 'undefined' || !format) {
    arrays = $.csv.toArrays(data)
  } else {
    arrays = $.csv.toArrays(data, format.options)
  }
  fixRaggedRows(arrays)
  hot.loadData(arrays)
  hot.render()
  // frictionless csv header default = true
  toggleHeaderNoFeedback(hot)
}

export function saveDataToFile(hot, format, filename, callback) {
  let tabId = tabStore.state.activeTab
  if (typeof filename === 'string') {
    tabStore.mutations.pushTabObject(tabStore.state, {id: tabId, filename: filename})
  } else {
    filename = _.get(tabStore.state.tabObjects, `${tabId}.filename`)
  }
  if (!filename) {
    return
  }
  if (typeof callback === 'undefined') {
    callback = (err) => {
      if (err) {
        console.log('There was a problem saving data to file.')
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
    data = $.csv.fromArrays(arrays)
  } else {
    data = $.csv.fromArrays(arrays, format.options)
  }
  fs.writeFile(filename, data, callback)
}
