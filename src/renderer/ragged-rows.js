// Fills undefined cells with an empty string, keeping the table in a
// rectangular format
//
export function fixRaggedRows(hot, worksheet) {
  const maxRowLength = getMaxRowLength(worksheet)
  window.setTimeout(function() {
    console.log('test delayed...')
  }, 3000)
  let updated = worksheet.map((row) => {
    row.push(...(Array(maxRowLength - row.length).fill('')))
    return row
  })
  hot.updateSettings({data: updated})
}

function getMaxRowLength(csv_array) {
  return Math.max(...(csv_array.map(row => row.length)))
}
