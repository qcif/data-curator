import {BrowserWindow, ipcMain as ipc, dialog as Dialog} from 'electron'
import XLSX from 'xlsx'
import {createWindowTabWithData} from './utils'

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

    let popup = new BrowserWindow({width: 300, height: 150})
    popup.loadURL(`http://localhost:9080/#/selectworksheet`)
    popup.webContents.on('did-finish-load', function() {
      popup.webContents.send('loadSheets', workbook.SheetNames)
      ipc.once('worksheetCanceled', function() {
        if (popup) {
          popup.close()
        }
      })
      ipc.once('worksheetSelected', function(e, sheet_name) {
        let data = XLSX.utils.sheet_to_csv(workbook.Sheets[sheet_name])
        if (popup) {
          popup.close()
        }
        createWindowTabWithData(data)
      })
    })
    popup.on('closed', function(e) {
      if (popup) {
        popup = null
      }
    })
  })
}
