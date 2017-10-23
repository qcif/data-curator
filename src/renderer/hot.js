import Handsontable from 'handsontable/dist/handsontable.full.js'
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
  getInstance(id) {
    return _.get(this.hots, id)
  },
  getActiveInstance() {
    let activeHot = document.querySelectorAll('#csvContent .active .editor')[0]
    console.log('getting active hot')
    console.log(activeHot.id)
    return this.getInstance(activeHot.id)
  },
  getActiveHotIdData() {
    let activeHot = this.getActiveInstance()
    return {'id': activeHot.guid, 'data': activeHot.getData()}
  },
  destroyAllHots() {
    _.forIn(this.hots, (hot, id) => {
      hot.destroy()
      _.unset(this.hots, id)
    })
    // just a safeguard
    this.hots = {}
  },
  destroyHot(id) {
    let hot = this.getInstance(id)
    if (hot) {
      hot.destroy()
    }
    _.unset(this.hots, id)
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
  let hot = HotRegister.getActiveInstance()
  hot.updateSettings({fixedRowsTop: 0, colHeaders: true})
}

const freezeHeaderRow = () => {
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
