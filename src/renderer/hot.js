import Handsontable from 'handsontable/dist/handsontable.full.js'
import loader from '../renderer/loader.js'
import jQuery from 'jquery/dist/jquery.js'
import {remote} from 'electron'
const Dialog = remote.dialog

let HotRegister = {
  hots: {},
  register: function(container) {
    let hot = new Handsontable(container, {
      colHeaders: true,
      rowHeaders: true,
      fixedRowsTop: 0,
      columnSorting: true,
      contextMenu: false,
      autoRowSize: true,
      enterBeginsEditing: false,
      persistentState: true,
      outsideClickDeselects: false,
      tabMoves: function(event) {
        if (!event.shiftKey) {
          var selection = hot.getSelected()
          let next = hot.getCell(selection[0], selection[1] + 1)
          if (next == null) {
            hot.alter('insert_col', selection[1] + 1)
          }
        }
        return {row: 0, col: 1}
      },
      // afterInit: function() {
      //   loader.showLoader('Loading...')
      // },
      // afterLoadData: function() {
      //   loader.hideLoader()
      // },
      afterUpdateSettings: function() {
        hot.render()
        hot.deselectCell()
      },
      enterMoves: function(event) {
        if (!event.shiftKey) {
          var selection = hot.getSelected()
          let next = hot.getCell(selection[0] + 1, selection[1])
          if (next == null) {
            hot.alter('insert_row', selection[0] + 1)
            return {
              row: 1,
              col: 0 - selection[1]
            }
          } else {
            return {row: 1, col: 0}
          }
        } else {
          return {row: 1, col: 0}
        }
      }
    })
    _.set(this.hots, hot.guid, hot)
  },
  getInstance: function(key) {
    // console.log(`getting ${key}`)
    return _.get(this.hots, key)
  },
  getActiveInstance: function() {
    let activeHotId = jQuery('#csvContent .active .editor').attr('id')
    // console.log(`active id for hot is: ${activeHotId}`)
    let hot = _.get(this.hots, activeHotId)
    // console.log(hot)
    return hot
  },
  getActiveHotIdData: function() {
    let activeHot = this.getActiveInstance()
    let data = activeHot.getData()
    let id = activeHot.guid
    return {'id': id, 'data': data}
  }
}

// export function getCurrentCell() {
//   let activeHot = HotRegister.getActiveInstance()
//   let currentCell = activeHot.getSelected()
//   if (currentCell[0] !== currentCell[2] || currentCell[1] !== currentCell[3]) {
//     console.log('only 1 cell can be selected')
//   } else {
//     return [currentCell[0], currentCell[2]]
//   }
// }

export function getActiveSelected () {
  let activeHot = HotRegister.getActiveInstance()
  return activeHot.getSelected()
}

export function getCurrentColumnIndexOrMin () {
  let activeHot = HotRegister.getActiveInstance()
  let currentCell = activeHot.getSelected()
  if (!currentCell) {
    activeHot.selectCell(0, 0)
    currentCell = activeHot.getSelected()
  }
  return currentCell[1]
}
export function getCurrentColumnIndexOrMax() {
  let activeHot = HotRegister.getActiveInstance()
  let currentCell = activeHot.getSelected()
  if (!currentCell) {
    let maxCol = getColumnCount() - 1
    activeHot.selectCell(0, maxCol)
    currentCell = activeHot.getSelected()
  }
  return currentCell[1]
}

export function incrementActiveColumn(activeColumnIndex) {
  let activeHot = HotRegister.getActiveInstance()
  activeHot.selectCell(0, activeColumnIndex + 1)
}

export function decrementActiveColumn(activeColumnIndex) {
  let activeHot = HotRegister.getActiveInstance()
  activeHot.selectCell(0, activeColumnIndex - 1)
}

export function getColumnCount() {
  let activeHot = HotRegister.getActiveInstance()
  let colCount = activeHot.countCols()
  console.log(`col count is: ${colCount}`)
  return colCount
}

var insertRowAbove = function(deselect) {
  let hot = HotRegister.getActiveInstance()
  hot.getActiveEditor().finishEditing(true)
  var range = hot.getSelectedRange()
  if (typeof range === 'undefined') {
    return
  }
  var start = Math.min(range.from.row, range.to.row)
  hot.alter('insert_row', start)
  if (deselect) {
    hot.deselectCell()
  }
}

var insertRowBelow = function(deselect) {
  let hot = HotRegister.getActiveInstance()
  hot.getActiveEditor().finishEditing(true)
  var range = hot.getSelectedRange()
  if (typeof range === 'undefined') {
    return
  }
  var end = Math.max(range.from.row, range.to.row)
  hot.alter('insert_row', (end + 1))
  if (deselect) {
    hot.deselectCell()
  }
}

var insertColumnLeft = function(deselect) {
  let hot = HotRegister.getActiveInstance()
  hot.getActiveEditor().finishEditing(true)
  var range = hot.getSelectedRange()
  if (typeof range === 'undefined') {
    return
  }
  var start = Math.min(range.from.col, range.to.col)
  hot.alter('insert_col', start)
  if (deselect) {
    hot.deselectCell()
  }
}

var insertColumnRight = function(deselect) {
  let hot = HotRegister.getActiveInstance()
  hot.getActiveEditor().finishEditing(true)
  var range = hot.getSelectedRange()
  if (typeof range === 'undefined') {
    return
  }
  var end = Math.max(range.from.col, range.to.col)
  hot.alter('insert_col', (end + 1))
  if (deselect) {
    hot.deselectCell()
  }
}

var removeRows = function() {
  let hot = HotRegister.getActiveInstance()
  var range = hot.getSelectedRange()
  if (typeof range === 'undefined') {
    return
  }

  var start = Math.min(range.from.row, range.to.row)
  var end = Math.max(range.from.row, range.to.row)

  for (var row = start; row <= end; row++) {
    // rows are re-indexed after each remove
    // so always remove 'start'
    hot.alter('remove_row', start)
  }

  hot.deselectCell()
}

var removeColumns = function() {
  let hot = HotRegister.getActiveInstance()
  var range = hot.getSelectedRange()
  if (typeof range === 'undefined') {
    return
  }

  var start = Math.min(range.from.col, range.to.col)
  var end = Math.max(range.from.col, range.to.col)

  for (var col = start; col <= end; col++) {
    // cols are re-indexed after each remove
    // so always remove 'start'
    hot.alter('remove_col', start)
  }

  hot.deselectCell()
}

var unfreezeHeaderRow = function() {
  console.log('unfreezing...')
  let hot = HotRegister.getActiveInstance()
  hot.updateSettings({fixedRowsTop: 0, colHeaders: true})
}

var freezeHeaderRow = function() {
  console.log('freezing...')
  let hot = HotRegister.getActiveInstance()
  hot.updateSettings({fixedRowsTop: 1})
}

export {
  insertRowAbove,
  insertRowBelow,
  insertColumnLeft,
  insertColumnRight,
  removeRows,
  removeColumns,
  freezeHeaderRow as freeze,
  unfreezeHeaderRow as unfreeze,
  HotRegister
}
