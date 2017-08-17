import Handsontable from 'handsontable/dist/handsontable.full.js'
import loader from '../renderer/loader.js'
import jQuery from 'jquery/dist/jquery.js'

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
      afterInit: function() {
        loader.showLoader('Loading...')
      },
      afterLoadData: function() {
        loader.hideLoader()
      },
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
    console.log(`getting ${key}`)
    return _.get(this.hots, key)
  },
  getActiveInstance: function() {
    console.log('inside get active instance.')
    let activeHotId = jQuery('#csvContent .active .editor').attr('id')
    console.log(`active hot id: ${activeHotId}`)
    return _.get(this.hots, activeHotId)
  }
}

// var initialise = function(container) {
//   var hot = new Handsontable(container, {
//     colHeaders: true,
//     rowHeaders: true,
//     fixedRowsTop: 0,
//     columnSorting: true,
//     contextMenu: false,
//     autoRowSize: true,
//     enterBeginsEditing: false,
//     persistentState: true,
//     tabMoves: function(event) {
//       if (!event.shiftKey) {
//         var selection = hot.getSelected()
//         next = hot.getCell(selection[0], selection[1] + 1)
//         if (next === null) {
//           hot.alter('insert_col', selection[1] + 1)
//         }
//       }
//       return {row: 0, col: 1}
//     },
//     afterInit: function() {
//       loader.showLoader('Loading...')
//     },
//     afterLoadData: function() {
//       loader.hideLoader()
//     },
//     afterUpdateSettings: function() {
//       hot.render()
//       hot.deselectCell()
//     },
//     enterMoves: function(event) {
//       if (!event.shiftKey) {
//         var selection = hot.getSelected()
//         next = hot.getCell(selection[0] + 1, selection[1])
//         if (next === null) {
//           hot.alter('insert_row', selection[0] + 1)
//           return {
//             row: 1,
//             col: 0 - selection[1]
//           }
//         } else {
//           return {row: 1, col: 0}
//         }
//       } else {
//         return {row: 1, col: 0}
//       }
//     }
//   })
//   // var hotInstance = $(container).handsontable('getInstance')
//   return hot
// }

var insertRowAbove = function(deselect) {
  // hot.loadData([
  //   ['', 'Ford', 'Volvo', 'Toyota', 'Honda'],
  //   ['2014', 10, 11, 12, 13],
  //   ['2015', 20, 11, 14],
  //   ['2016', 30, 15, 12, 13]
  // ])
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
