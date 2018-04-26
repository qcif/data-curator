import {ipcMain as ipc, dialog as Dialog} from 'electron'
import XLSX from 'xlsx'
import {createWindowTabWithData, focusOrNewSecondaryWindow, closeWindowSafely} from './windows'
import {getSubMenuFromMenu} from './menu.js'

export function importExcel() {
  Dialog.showOpenDialog({
    filters: [
      {
        name: 'text',
        extensions: ['xlsx', 'xls']
      }
    ]
  }, function(fileNames) {
    if (fileNames === undefined) { return }
    var fileName = fileNames[0]
    var workbook = XLSX.readFile(fileName)
    var first_sheet_name = workbook.SheetNames[0]
    var worksheet = workbook.Sheets[first_sheet_name]

    let shortcutsSubMenu = getSubMenuFromMenu('File', 'Open Excel Sheet...')
    shortcutsSubMenu.enabled = false
    let browserWindow = focusOrNewSecondaryWindow('openexcel', {width: 300, height: 150})
    browserWindow.on('closed', function () {
      shortcutsSubMenu.enabled = true
    })
    browserWindow.webContents.on('did-finish-load', function() {
      browserWindow.webContents.send('loadSheets', workbook.SheetNames)
      ipc.once('worksheetCanceled', function() {
        closeWindowSafely(browserWindow)
      })
      ipc.once('worksheetSelected', function(e, sheet_name) {
        let data = XLSX.utils.sheet_to_csv(workbook.Sheets[sheet_name])
        closeWindowSafely(browserWindow)
        createWindowTabWithData(data)
      })
    })
  })
}
