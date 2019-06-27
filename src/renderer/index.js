import { HotRegister, insertRowAbove, insertRowBelow, insertColumnBefore, insertColumnAfter, removeRows, removeColumns } from '@/hot.js'
import { loadDataIntoHot, saveDataToFile } from '@/data-actions.js'
import { ipcRenderer as ipc, remote } from 'electron'
import { isCaseSensitive } from '@/frictionlessUtilities'
import { pushCsvDialect } from '@/dialect.js'
import { menu } from '@/menu.js'
import { fileFormats } from '@/file-formats.js'
import fs from 'fs-extra'
import store from '@/store'

export function addHotContainerListeners(container, loadingFn, closeLoadingFn) {
  container.ondragover = function() {
    return false
  }
  container.ondragleave = container.ondragend = function() {
    return false
  }
  container.ondrop = function(e) {
    e.preventDefault()
    var f = e.dataTransfer.files[0]
    loadingFn('Loading data. Please wait...')
    fs.readFile(f.path, 'utf-8', function(err, data) {
      if (err) {
        console.error(err)
      } else {
        let hot = HotRegister.getActiveInstance()
        const tabId = store.getters.getTabIdFromHotId(hot.guid)
        // if we're dragging a file in, default the format to comma-separated
        loadData(hot.guid, data, fileFormats.csv, closeLoadingFn)
        store.commit('pushTabObject', { id: tabId, filename: f.path })
      }
    })
  }

  container.addEventListener('contextmenu', function(e) {
    e.preventDefault()
    menu.popup(getWindow('home'), { async: true })
  }, false)
}

export function getWindow(name, id) {
  let browserWindow
  let windowId = id || remote.getGlobal('windows')[name]
  if (windowId) {
    browserWindow = remote.BrowserWindow.fromId(windowId)
  }
  return browserWindow
}

export function loadData(key, data, format, closeLoadingFn) {
  let hot = HotRegister.getInstance(key)
  try {
    loadDataIntoHot(hot, data, format)
  } catch (error) {
    console.error('error in parse', error)
    ipc.send('dataParsingError')
    closeLoadingFn()
  }
}

ipc.on('saveData', function(e, format, fileName) {
  let hot = HotRegister.getActiveInstance()
  // ensure that cell (and its row) holding cursor is committed
  hot.deselectCell()
  saveDataToFile(hot, format, fileName)
  let selection = store.getters.getHotSelection(hot.guid)
  // reselect cell after save
  if (selection) {
    hot.selectCell(selection[0], selection[1], selection[2], selection[3])
  }
})

ipc.on('editUndo', function() {
  let hot = HotRegister.getActiveInstance()
  if (hot.isUndoAvailable) {
    hot.undo()
  } else {
    // console.log('undo is not available')
  }
})

ipc.on('editRedo', function() {
  let hot = HotRegister.getActiveInstance()
  if (hot.isRedoAvailable) {
    hot.redo()
  } else {
    // console.log('redo is not available')
  }
})

ipc.on('editSelectAll', function() {
  let hot = HotRegister.getActiveInstance()
  hot.selectCell(0, 0, (hot.countRows() - 1), (hot.countCols() - 1))
})

ipc.on('insertRowAbove', function() {
  insertRowAbove()
})

ipc.on('insertRowBelow', function() {
  insertRowBelow()
})

ipc.on('clickLabelOnContextMenu', function(event, arg) {
  menu.items.find(x => x.label === arg).click()
})

ipc.on('closeContextMenu', function() {
  menu.closePopUp(getWindow('home'))
})

ipc.on('insertColumnBefore', function() {
  insertColumnBefore()
})

ipc.on('insertColumnAfter', function() {
  insertColumnAfter()
})

ipc.on('removeRows', function() {
  removeRows()
})

ipc.on('removeColumns', function() {
  removeColumns()
})

ipc.on('toggleCaseSensitiveHeader', function() {
  let hotId = HotRegister.getActiveInstance().guid
  const toggledCase = !isCaseSensitive(hotId)
  pushCsvDialect(hotId, { caseSensitiveHeader: toggledCase })
  ipc.send('hasCaseSensitiveHeader', toggledCase)
})

ipc.on('importColumnProperties', function() {
  console.log('arrived')
})

export function closeSecondaryWindow(windowName) {
  ipc.sendSync('closeSecondaryWindow', windowName)
}

ipc.on('loadDataIntoCurrentHot', function(event, stringified) {
  loadDataIntoCurrentHot(JSON.parse(stringified))
})

// convenience method for testing
function loadDataIntoCurrentHot(data) {
  const hot = HotRegister.getActiveInstance()
  loadDataIntoHot(hot, data)
  return hot
}
