'use strict'

// Fills undefined cells with an empty string, keeping the table in a
// rectangular format
//
var amendRows = function(hot, worksheet) {
// ragged_rows is unknown
  var ragged_rows = 0
  // find the maximum number of columns in the table
  var maxColumns = getMaxColumns(worksheet)
  // for every row
  for (var y = 0; y < worksheet.length; y++) {
    // for every cell in the row up to the maximum number of columns
    for (var x = 0; x < maxColumns; x++) {
      // test if the cell is null
      if (hot.getDataAtCell(y, x) == null) {
      // fix the missing cell
        worksheet[y].push('')
        updateTable(hot, worksheet)
      // set ragged_rows to true to potentially show information message
        ragged_rows = 1
      }
    }
  }

// Information message
  if (ragged_rows === 1) {
    document.querySelector('#main-bottom-panel').classList.remove('hidden')
    var messagePanel = document.getElementById('message-panel')
    messagePanel.innerHTML += '<p>Ragged rows corrected<p>'
  }
}

function getMaxColumns(csv_array) {
  var max_columns = 0
  for (var i = 0; i < csv_array.length; i++) {
    var col_length = csv_array[i].length
    if (col_length > max_columns) {
      max_columns = col_length
    }
  }
  return max_columns
}

var updateTable = function(hot, csv_array) {
  hot.updateSettings({data: csv_array})
}

module.exports = {
  fixRaggedRows: amendRows
}
