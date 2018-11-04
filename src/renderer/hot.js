import Handsontable from 'handsontable/dist/handsontable.full.min.js'
import { ipcRenderer as ipc } from 'electron'
import store from '@/store/modules/hots.js'
import { allTablesAllColumnsFromSchema$, allTablesAllColumnNames$, afterSetDataAtCell$ } from '@/rxSubject.js'

const _hots = {}

const HotRegister = {
  register(container, listeners={}, searchParameters = false) {
    let hot = new Handsontable(container, {
      // do not allow headers on initialisation - no default headers unless toggled
      colHeaders: false,
      rowHeaders: true,
      // autoColumnSize: {syncLimit: 300},
      fixedRowsTop: 0,
      // enable when header row function implemented - otherwise header is sorted with values
      columnSorting: true,
      sortIndicator: true,
      contextMenu: false,
      autoRowSize: true,
      autoWrap: true,
      manualRowResize: true,
      manualColumnResize: true,
      manualRowMove: true,
      enterBeginsEditing: false,
      persistentState: true,
      // outsideClickDeselects: must be set to true -
      // -otherwise visibleRows will include ALL rows (even for large datasets), which will affect performance when switching tabs (https://github.com/ODIQueensland/data-curator/issues/387)
      outsideClickDeselects: true,
      // delay to ensure no conflict with other renderer functionality
      comments: {
        displayDelay: 100
      },
      undo: true,
      search: searchParameters,
      tabMoves({ shiftKey }) {
        if (!shiftKey) {
          const selection = hot.getSelectedLast()
          let next = hot.getCell(selection[0], selection[1] + 1)
          if (next == null) {
            hot.alter('insert_col', selection[1] + 1)
          }
        }
        return { row: 0, col: 1 }
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
      },
      afterSelection(r, c, r2, c2, preventScrolling, selectionLayerLevel) {
      // preventScrolling.value = true
        if (typeof listeners.selectionListener !== 'undefined') {
          listeners.selectionListener()
        }
      },
      afterDeselect() {
        if (typeof listeners.deselectionListener !== 'undefined') {
          listeners.deselectionListener()
        }
      },
      afterSetDataAtCell() {
        afterSetDataAtCell$.next(true)
      },
      enterMoves({ shiftKey }) {
        if (!shiftKey) {
          const selection = hot.getSelectedLast()
          let next = hot.getCell(selection[0] + 1, selection[1])
          if (next == null) {
            hot.alter('insert_row', selection[0] + 1)
            return {
              row: 1,
              col: 0 - selection[1]
            }
          } else {
            return { row: 1, col: 0 }
          }
        } else {
          return { row: 1, col: 0 }
        }
      }
    })
    _.set(_hots, hot.guid, hot)
    return hot.guid
  },
  getInstance(id) {
    return _.get(_hots, id)
  },
  getAllHotIds() {
    return _.keys(_hots)
  },
  getHotCount() {
    return _hots.length
  },
  // TODO: consider cache (vue computed) of method, and moving to Home.vue to use with props, as used a lot
  getActiveInstance() {
    let activeHot = this.activeQuery()
    if (activeHot) {
      return this.getInstance(activeHot.id)
    }
  },
  activeQuery() {
    return document.querySelectorAll('#csvContent .active .editor')[0]
  },
  getActiveHotIdData() {
    let activeHot = this.getActiveInstance()
    return { 'id': activeHot.guid, 'data': activeHot.getData() }
  },
  destroyAllHots() {
    _.forIn(_hots, (hot, id) => {
      hot.destroy()
      _.unset(_hots, id)
    })
  },
  destroyHot(id) {
    let hot = this.getInstance(id)
    if (hot) {
      hot.destroy()
    }
    _.unset(_hots, id)
  }
}

export function getCurrentColumnIndexOrMin() {
  let activeHot = HotRegister.getActiveInstance()
  let currentCell = activeHot.getSelectedLast()
  if (!currentCell) {
    activeHot.selectCell(0, 0)
    currentCell = activeHot.getSelectedLast()
  }
  return currentCell[1]
}

export function reselectCurrentCellOrMin() {
  let activeHot = HotRegister.getActiveInstance()
  let currentCell = activeHot.getSelectedLast()
  if (!currentCell) {
    activeHot.selectCell(0, 0)
  } else {
    activeHot.selectCell(currentCell[0], currentCell[1])
  }
}

export function getColumnCount() {
  let activeHot = HotRegister.getActiveInstance()
  let colCount
  if (activeHot) {
    colCount = activeHot.countCols()
  }
  return colCount
}

export function insertRowAbove() {
  insertRow(0, Math.min)
}

export function insertRowBelow() {
  insertRow(1, Math.max)
}

export function insertRow(offset, mathFn) {
  let hot = getHotToInsert()
  const range = hot.getSelectedRangeLast()
  if (typeof range !== 'undefined') {
    const selection = mathFn(range.from.row, range.to.row) + offset
    hot.alter('insert_row', selection)
    hot.selectCell(selection, 0)
  }
}

export function insertColumnLeft() {
  insertColumn(0, Math.min)
}

export function insertColumnRight() {
  insertColumn(1, Math.max)
}

export function insertColumn(offset, mathFn) {
  let hot = getHotToInsert()
  const range = hot.getSelectedRangeLast()
  if (typeof range !== 'undefined') {
    const selection = mathFn(range.from.col, range.to.col) + offset
    hot.alter('insert_col', selection)
    store.mutations.pushColumnIndexForHotId(store.state, { hotId: hot.guid, columnIndex: selection })
    removeHeaderAtIndex(hot, selection)
    // needed for sidenav arrows reset
    reselectCurrentCellOrMin()
  }
}

function getHotToInsert() {
  let hot = HotRegister.getActiveInstance()
  hot.getActiveEditor().finishEditing(true)
  return hot
}

export function removeHeaderAtIndex(hot, index) {
  if (hot.hasColHeaders()) {
    let header = hot.getColHeader()
    header[index] = null
    hot.updateSettings({ colHeaders: header })
    store.mutations.pushColumnProperty(store.state, { hotId: hot.guid, columnIndex: index, key: 'name', value: '' })
  }
}

export function removeRows() {
  let hot = HotRegister.getActiveInstance()
  const range = hot.getSelectedRangeLast()
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
  reselectCurrentCellOrMin()
}

export function removeColumns() {
  let hot = HotRegister.getActiveInstance()
  const range = hot.getSelectedRangeLast()
  if (typeof range === 'undefined') {
    return
  }
  const start = Math.min(range.from.col, range.to.col)
  const end = Math.max(range.from.col, range.to.col)
  for (let col = start; col <= end; col++) {
    // cols are re-indexed after each remove
    // so always remove 'start'
    hot.alter('remove_col', start)
    store.mutations.removeColumnIndexForHotId(store.state, { hotId: hot.guid, columnIndex: start })
    allTablesAllColumnsFromSchema$.next(store.getters.getAllHotTablesColumnProperties(store.state, store.getters)())
    allTablesAllColumnNames$.next(store.getters.getAllHotTablesColumnNames(store.state, store.getters)())
  }
  reselectCurrentCellOrMin()
}

ipc.on('selectHotCell', function(event, rowCountNumber, ColCountNumber) {
  let hot = HotRegister.getActiveInstance()
  hot.selectCell(rowCountNumber - 1, ColCountNumber - 1)
})

export {
  HotRegister
}
