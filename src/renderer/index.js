import {HotRegister, insertRowAbove, insertRowBelow, insertColumnLeft, insertColumnRight, removeRows, removeColumns} from '@/hot.js'
import {loadDataIntoHot, saveDataToFile} from '@/data-actions.js'
import {ipcRenderer as ipc, remote} from 'electron'
import {isCaseSensitive} from '@/frictionlessUtilities'
import {pushCsvDialect} from '@/dialect.js'
import {menu} from '@/menu.js'
import fs from 'fs-extra'

export function addHotContainerListeners(container) {
  container.ondragover = function() {
    return false
  }
  container.ondragleave = container.ondragend = function() {
    return false
  }
  container.ondrop = function(e) {
    e.preventDefault()
    var f = e.dataTransfer.files[0]
    fs.readFile(f.path, 'utf-8', function(err, data) {
      if (err) {
        console.log(err)
      }
      // if we're dragging a file in, default the format to comma-separated
      loadData(hot, data, file.formats.csv)
    })
  }

  container.addEventListener('contextmenu', function(e) {
    e.preventDefault()
    menu.popup(getHomeWindow(), {async: true})
  }, false)
}

export function getHomeWindow() {
  let mainWindowId = remote.getGlobal('windows')['mainWindowId']
  let mainWindow = remote.BrowserWindow.fromId(mainWindowId)
  return mainWindow
}

export function loadData(key, data, format) {
  let hot = HotRegister.getInstance(key)
  loadDataIntoHot(hot, data, format)
}

ipc.on('saveData', function(e, format, fileName) {
  let hot = HotRegister.getActiveInstance()
  saveDataToFile(hot, format, fileName)
})

// TODO: correct once github references re-introduced
ipc.on('getCSV', function(e, format) {
  let hot = HotRegister.getActiveInstance()
  var data
  // if no format specified, default to csv
  // TODO: update to node csv and check dialect mappings
  // if (typeof format === 'undefined') {
  //   data = $.csv.fromArrays(hot.getData())
  // } else {
  //   data = $.csv.fromArrays(hot.getData(), format.options)
  // }
  ipc.send('sendCSV', data)
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
  menu.closePopUp(getHomeWindow())
})

ipc.on('insertColumnLeft', function() {
  insertColumnLeft()
})

ipc.on('insertColumnRight', function() {
  insertColumnRight()
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
  pushCsvDialect(hotId, {caseSensitiveHeader: toggledCase})
  ipc.send('hasCaseSensitiveHeader', toggledCase)
})
