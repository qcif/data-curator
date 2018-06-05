Handsontable upgrade notes to 3.0.0

Compatible?
0.36
hot.alter
// afterSelection
//   previously: afterSelection(row, column, rowEnd, columnEnd, preventScrolling)
//   now: afterSelection(row, column, rowEnd, columnEnd, preventScrolling, selectionLayerLevel)

Breaking
0.36
hot.getSelected() Returns an array of arrays with the coordinates of all layers ([[row, col, rowEnd, colEnd], [row, col, rowEnd, colEnd] ...]);
hot.getSelectedRange() Returns an array of CellRange objects with the coordinates of all layers ([{CellRange}, {CellRange} ...]);
colours:
  area borders, was #89aff9 -> is #4b89ff
  area background, was #b5d1ff -> is #005eff
  current selection border, was #5292f7 -> is #4b89ff
