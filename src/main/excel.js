import { ipcMain as ipc, dialog as Dialog } from 'electron'
import XLSX from 'xlsx'
import { createWindowTabWithData, focusOrNewSecondaryWindow, closeWindowSafely } from './windows'
import { disableOpenFileItems, enableOpenFileItems } from './menuUtils.js'

export function importExcel() {
  disableOpenFileItems()
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
    // var first_sheet_name = workbook.SheetNames[0]
    // var worksheet = workbook.Sheets[first_sheet_name]
    let browserWindow = focusOrNewSecondaryWindow('openexcel', { width: 300, height: 150 })
    browserWindow.on('closed', function () {
      enableOpenFileItems()
    })
    browserWindow.webContents.on('did-finish-load', function() {
      browserWindow.webContents.send('loadSheets', workbook.SheetNames)
      ipc.once('worksheetCanceled', function() {
        closeWindowSafely(browserWindow)
      })
      ipc.once('worksheetSelected', function(e, sheet_name) {
        var data = XLSX.utils.sheet_to_json(workbook.Sheets[sheet_name], { header: 1 })
        closeWindowSafely(browserWindow)
        createWindowTabWithData(data)
      })
    })
  })
}
