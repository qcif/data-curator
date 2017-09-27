// Fills undefined cells with an empty string, keeping the table in a
// rectangular format
//
export function fixRaggedRows(hot, arrays) {
  const maxRowLength = getMaxRowLength(arrays)
  let updated = arrays.map((row) => {
    row.push(...(Array(maxRowLength - row.length).fill('')))
    return row
  })
  hot.updateSettings({data: updated})
}

function getMaxRowLength(csv_array) {
  return Math.max(...(csv_array.map(row => row.length)))
}

export function matchColumnHeadersToMaxRowLength(hot, arrays) {
  const maxRowLength = getMaxRowLength(arrays)
  arrays[0].push(...(Array(maxRowLength - arrays[0].length).fill('')))
  hot.updateSettings({data: arrays})
}
