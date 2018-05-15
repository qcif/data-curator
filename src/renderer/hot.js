import Handsontable from 'handsontable/dist/handsontable.full.min.js'
import {remote, ipcRenderer as ipc} from 'electron'
import store from '@/store/modules/hots.js'
import {allTablesAllColumnsFromSchema$, allTablesAllColumnNames$, afterSetDataAtCell$} from '@/rxSubject.js'
const Dialog = remote.dialog

const _hots = {}
const searchCallback = Handsontable.plugins.Search.DEFAULT_CALLBACK
const searchQueryMethod = Handsontable.plugins.Search.DEFAULT_QUERY_METHOD
let hDom = Handsontable.dom

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
      // currentRowClassName: 'currentRow',
      // currentColClassName: 'currentCol',
      // outsideClickDeselects: must be set to true -
      // -otherwise visibleRows will include ALL rows (even for large datasets), which will affect performance when switching tabs (https://github.com/ODIQueensland/data-curator/issues/387)
      outsideClickDeselects: true,
      comments: {
        displayDelay: 1000
      },
      undo: true,
      search: searchParameters,
      // search: true,
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
          listeners.loadingStartListener('Loading data. Please wait...', 'There was a problem loading data. Please check that the data is valid.')
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
      afterSelection(r, c, r2, c2, preventScrolling) {
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
    _.set(_hots, hot.guid, hot)
    return hot.guid
  },
  getInstance(id) {
    let hot = _.get(_hots, id)
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
    return {'id': activeHot.guid, 'data': activeHot.getData()}
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

export function getActiveSelected() {
  let activeHot = HotRegister.getActiveInstance()
  return activeHot.getSelected()
}

export function getActiveSelectedOrHotSelectionOrMin() {
  let activeHot = HotRegister.getActiveInstance()
  let currentCell = activeHot.getSelected()
  if (!currentCell) {
    currentCell = store.getters.getHotSelection(store.state, store.getters)(activeHot.guid)
  }
  if (!currentCell) {
    activeHot.selectCell(0, 0)
    currentCell = activeHot.getSelected()
  }
  return currentCell
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

export function reselectCellOrMin(hotId) {
  let activeHot = HotRegister.getInstance(hotId)
  let currentCell = activeHot.getSelected()
  if (!currentCell) {
    activeHot.selectCell(0, 0)
    // currentCell = activeHot.getSelected()
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

export function getColumnCount() {
  let activeHot = HotRegister.getActiveInstance()
  let colCount
  if (activeHot) {
    colCount = activeHot.countCols()
  }
  return colCount
}

export function getColumnCountFromInstance(hot) {
  let colCount = hot.countCols()
  return colCount
}

export function getColumnCountFromInstanceId(hotId) {
  let hot = HotRegister.getInstan(hotId)
  let colCount = hot.countCols()
  return colCount
}

export function waitForHotInstance() {
  return new Promise((resolve, reject) => {
    let hot = HotRegister.getActiveInstance()
    if (!hot) {
      _.delay(function() {
        resolve(HotRegister.getActiveInstance())
      }, 100)
    } else {
      resolve(hot)
    }
  })
}

export function insertRowAbove() {
  insertRow(0, Math.min)
}

export function insertRowBelow() {
  insertRow(1, Math.max)
}

export function insertRow(offset, mathFn) {
  let hot = getHotToInsert()
  const range = hot.getSelectedRange()
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
  const range = hot.getSelectedRange()
  if (typeof range !== 'undefined') {
    const selection = mathFn(range.from.col, range.to.col) + offset
    hot.alter('insert_col', selection)
    store.mutations.pushColumnIndexForHotId(store.state, {hotId: hot.guid, columnIndex: selection})
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
    hot.updateSettings({colHeaders: header})
    store.mutations.pushColumnProperty(store.state, {hotId: hot.guid, columnIndex: index, key: 'name', value: ''})
  }
}

export function removeRows() {
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
  reselectCurrentCellOrMin()
}

export function removeColumns() {
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
    store.mutations.removeColumnIndexForHotId(store.state, {hotId: hot.guid, columnIndex: start})
    allTablesAllColumnsFromSchema$.next(store.getters.getAllHotTablesColumnProperties(store.state, store.getters)())
    allTablesAllColumnNames$.next(store.getters.getAllHotTablesColumnNames(store.state, store.getters)())
  }
  reselectCurrentCellOrMin()
}

ipc.on('reselectCurrentCellOrMin', function(event, arg) {
  reselectCurrentCellOrMin()
})

ipc.on('selectHotCell', function(event, rowCountNumber, ColCountNumber) {
  let hot = HotRegister.getActiveInstance()
  hot.selectCell(rowCountNumber - 1, ColCountNumber - 1)
})

export {
  HotRegister,
  searchCallback,
  searchQueryMethod,
  hDom
}
