import tabStore from '../renderer/store/modules/tabs.js'
import {remote} from 'electron'
import fs from 'fs'
const $ = global.jQuery = require('jquery/dist/jquery.js')
require('jquery-csv/src/jquery.csv.js')

export function loadDataIntoHot(hot, data, format) {
  let arrays
  // if no format specified, default to csv
  if (typeof format === 'undefined') {
    arrays = $.csv.toArrays(data)
  } else {
    arrays = $.csv.toArrays(data, format.options)
  }
  hot.loadData(arrays)
  return arrays
}

export function saveDataToFile(hot, format, filename, callback) {
  let data
  let tabId = tabStore.state.activeTab
  if (typeof filename === 'string') {
    tabStore.mutations.pushTabObject(tabStore.state, {id: tabId, filename})
  } else {
    filename = _.get(tabStore.state.tabObjects, `${tabId}.filename`)
  }
  // if no format specified, default to csv
  if (typeof format === 'undefined') {
    data = $.csv.fromArrays(hot.getData())
  } else {
    data = $.csv.fromArrays(hot.getData(), format.options)
  }
  if (!filename) {
    return
  }
  if (typeof callback === 'undefined') {
    fs.writeFile(filename, data, err => {
      if (err) {
        console.log(err.stack)
      }
    })
  } else {
    fs.writeFile(filename, data, callback)
  }
}
