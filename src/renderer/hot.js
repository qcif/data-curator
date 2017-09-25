import Handsontable from 'handsontable/dist/handsontable.full.js'
import loader from '../renderer/loader.js'
import jQuery from 'jquery/dist/jquery.js'
import {remote} from 'electron'
const Dialog = remote.dialog

let HotRegister = {
  hots: {},
  register(container, listeners={}) {
    let hot = new Handsontable(container, {
      colHeaders: true,
      rowHeaders: true,
      // autoColumnSize: {syncLimit: 300},
      fixedRowsTop: 0,
      // enable when header row function implemented - otherwise header is sorted with values
      columnSorting: false,
      sortIndicator: false,
      contextMenu: false,
      autoRowSize: true,
      autoWrap: true,
      manualRowResize: true,
      manualColumnResize: true,
      manualRowMove: true,
      enterBeginsEditing: false,
      persistentState: true,
      outsideClickDeselects: false,
      tabMoves({shiftKey}) {
        if (!shiftKey) {
          const selection = hot.getSelected()
          let next = hot.getCell(selection[0], selection[1] + 1)
          if (next == null) {
            hot.alter('insert_col', selection[1] + 1)
          }
        }
        return {row: 0, col: 1}
      },
      afterInit() {
        if (typeof listeners.loadingStartListener !== 'undefined') {
          listeners.loadingStartListener('Loading data. Please wait...')
        }
      },
      afterLoadData(firstTime) {
        if (typeof listeners.loadingFinishListener !== 'undefined') {
          listeners.loadingFinishListener()
        }
      },
      afterUpdateSettings() {
        hot.render()
        hot.deselectCell()
      },
      afterSelection(r, c, r2, c2, preventScrolling) {
        // preventScrolling.value = true
        if (typeof listeners.selectionListener !== 'undefined') {
          listeners.selectionListener()
        }
      },
      enterMoves({shiftKey}) {
        if (!shiftKey) {
          const selection = hot.getSelected()
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
    return hot.guid
  },
  getInstance(key) {
    return _.get(this.hots, key)
  },
  getActiveInstance() {
    let activeHotId = jQuery('#csvContent .active .editor').attr('id')
    let hot = _.get(this.hots, activeHotId)
    return hot
  },
  getActiveHotIdData() {
    let activeHot = this.getActiveInstance()
    let data = activeHot.getData()
    let id = activeHot.guid
    return {'id': id, 'data': data}
  },
  destroy(id) {
    _.forIn(this.hots, (hot, id) => {
      hot.destroy()
    })
    for (const key in this.hots) {
      _.unset(this.hots, key)
    }
    this.hots = {}
  }
}

export function getActiveSelected() {
  let activeHot = HotRegister.getActiveInstance()
  return activeHot.getSelected()
}

export function getCurrentColumnIndexOrMin() {
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
  console.log(`current column index is ${currentCell[1]}`)
  return currentCell[1]
}

export function reselectCurrentCellOrMin() {
  let activeHot = HotRegister.getActiveInstance()
  let currentCell = activeHot.getSelected()
  if (!currentCell) {
    activeHot.selectCell(0, 0)
    currentCell = activeHot.getSelected()
  } else {
    activeHot.selectCell(currentCell[0], currentCell[1])
  }
}

export function reselectCurrentCellOrMax() {
  let activeHot = HotRegister.getActiveInstance()
  let currentCell = activeHot.getSelected()
  if (!currentCell) {
    let maxCol = getColumnCount() - 1
    activeHot.selectCell(0, maxCol)
  } else {
    activeHot.selectCell(currentCell[0], currentCell[1])
  }
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

const insertRowAbove = deselect => {
  let hot = HotRegister.getActiveInstance()
  hot.getActiveEditor().finishEditing(true)
  const range = hot.getSelectedRange()
  if (typeof range === 'undefined') {
    return
  }
  const start = Math.min(range.from.row, range.to.row)
  hot.alter('insert_row', start)
  if (deselect) {
    hot.deselectCell()
  }
}

const insertRowBelow = deselect => {
  let hot = HotRegister.getActiveInstance()
  hot.getActiveEditor().finishEditing(true)
  const range = hot.getSelectedRange()
  if (typeof range === 'undefined') {
    return
  }
  const end = Math.max(range.from.row, range.to.row)
  hot.alter('insert_row', (end + 1))
  if (deselect) {
    hot.deselectCell()
  }
}

const insertColumnLeft = deselect => {
  let hot = HotRegister.getActiveInstance()
  hot.getActiveEditor().finishEditing(true)
  const range = hot.getSelectedRange()
  if (typeof range === 'undefined') {
    return
  }
  const start = Math.min(range.from.col, range.to.col)
  hot.alter('insert_col', start)
  if (deselect) {
    hot.deselectCell()
  }
}

const insertColumnRight = deselect => {
  let hot = HotRegister.getActiveInstance()
  hot.getActiveEditor().finishEditing(true)
  const range = hot.getSelectedRange()
  if (typeof range === 'undefined') {
    return
  }
  const end = Math.max(range.from.col, range.to.col)
  hot.alter('insert_col', (end + 1))
  if (deselect) {
    hot.deselectCell()
  }
}

const removeRows = () => {
  let hot = HotRegister.getActiveInstance()
  const range = hot.getSelectedRange()
  if (typeof range === 'undefined') {
    return
  }

  const start = Math.min(range.from.row, range.to.row)
  const end = Math.max(range.from.row, range.to.row)

  for (let row = start; row <= end; row++) {
    // rows are re-indexed after each remove
    // so always remove 'start'
    hot.alter('remove_row', start)
  }

  hot.deselectCell()
}

const removeColumns = () => {
  let hot = HotRegister.getActiveInstance()
  const range = hot.getSelectedRange()
  if (typeof range === 'undefined') {
    return
  }

  const start = Math.min(range.from.col, range.to.col)
  const end = Math.max(range.from.col, range.to.col)

  for (let col = start; col <= end; col++) {
    // cols are re-indexed after each remove
    // so always remove 'start'
    hot.alter('remove_col', start)
  }

  hot.deselectCell()
}

const unfreezeHeaderRow = () => {
  console.log('unfreezing...')
  let hot = HotRegister.getActiveInstance()
  hot.updateSettings({fixedRowsTop: 0, colHeaders: true})
}

const freezeHeaderRow = () => {
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
