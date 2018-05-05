import tabStore from '@/store/modules/tabs.js'
import fs from 'fs'
import {fixRaggedRows} from '@/ragged-rows.js'
import {includeHeadersInData} from '@/frictionlessUtilities.js'
import {toggleHeaderNoFeedback} from '@/headerRow.js'
import {pushCsvFormat} from '@/dialect.js'
var parse = require('csv-parse/lib/sync')
var stringify = require('csv-stringify/lib/sync')

// { delimiter: ',', lineTerminator, quoteChar, doubleQuote, escapeChar, nullSequence, skipInitialSpace, header, caseSensitiveHeader, csvddfVersion }
const frictionlessToCsvmapper = {delimiter: 'delimiter', lineTerminator: 'rowDelimiter', quoteChar: 'quote', escapeChar: 'escape', skipInitialSpace: 'ltrim'}
export function loadDataIntoHot(hot, data, format) {
  if (_.isArray(data)) {
    loadArrayDataIntoHot(hot, data, format)
  } else {
    loadCsvDataIntoHot(hot, data, format)
  }
}

export function loadCsvDataIntoHot(hot, data, format) {
  // console.log(`hot is ${hot}`)
  // console.log('data is', data)
  // console.log('format is', format)
  try {
    let arrays
    // if no format specified, default to csv
    if (typeof format === 'undefined' || !format) {
      arrays = parse(data)
    } else {
      let csvOptions = dialectToCsvOptions(format.dialect)
      // let csv parser handle the line terminators
      _.unset(csvOptions, 'rowDelimiter')
      // TODO: update to stream
      arrays = parse(data, csvOptions)
      pushCsvFormat(hot.guid, format)
    }

    fixRaggedRows(arrays)
    hot.loadData(arrays)
    hot.render()
    // frictionless csv header default = true
    toggleHeaderNoFeedback(hot)
  } catch (error) {
    console.log('There was a problem loading data', error)
  }
}

export function loadArrayDataIntoHot(hot, arrays, format) {
  pushCsvFormat(hot.guid, format)

  fixRaggedRows(arrays)
  hot.loadData(arrays)
  hot.render()
  // frictionless csv header default = true
  toggleHeaderNoFeedback(hot)
}

// poc : debug line terminators
// export function checkLineTerminators() {
//   let rNMatch = false
//   _.mapKeys({'\r\n': '\\r\\n', '\r': '\\r', '\n': '\\n'}, function(output, lineT) {
//     // console.log(encodeURIComponent(lineT))
//     let match = 0
//     if (!rNMatch) {
//       const regExp = new RegExp(lineT, 'g')
//       match = data.match(regExp) || 0
//     }
//     const matchCount = match && match.length
//     const isMatch = !!(match.length > 0)
//
//     console.log(`Is the line terminator: ${output}`)
//     console.log(`${isMatch}: ${matchCount}`)
//     if (output === '\\r\\n') {
//       rNMatch = true
//     }
//   })
// }

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
    // TODO: update to stream
    data = stringify(arrays)
  } else {
    let csvOptions = dialectToCsvOptions(format.dialect)
    data = stringify(arrays, csvOptions)
    pushCsvFormat(hot.guid, format)
  }
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
