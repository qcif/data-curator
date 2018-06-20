// Fills undefined cells with an empty string, keeping the table in a rectangular format
export function fixRaggedRows(arrays) {
  const maxRowLength = getMaxRowLength(arrays)
  _.forEach(arrays, (row) => {
    row.push(...(Array(maxRowLength - row.length).fill('')))
  })
}

function getMaxRowLength(csv_array) {
  return Math.max(...(csv_array.map(row => row.length)))
}
