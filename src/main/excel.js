import {BrowserWindow, ipcMain as ipc, dialog as Dialog} from 'electron'
import XLSX from 'xlsx'
import {createWindowTabWithData, getExcelWindow} from './utils'

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

    let excelWindow = getExcelWindow()
    excelWindow.setMenu(null)
    const winURL = process.env.NODE_ENV === 'development'
      ? `http://localhost:9080/openexcel.html`
      : `file://${__dirname}/openexcel.html`
    excelWindow.loadURL(winURL)
    excelWindow.setMenu(null)
    excelWindow.on('show', function() {
      global.excelWindowId = excelWindow.id
    })
    excelWindow.webContents.on('did-finish-load', function() {
      excelWindow.webContents.send('loadSheets', workbook.SheetNames)
      ipc.once('worksheetCanceled', function() {
        if (excelWindow) {
          excelWindow.close()
        }
      })
      ipc.once('worksheetSelected', function(e, sheet_name) {
        let data = XLSX.utils.sheet_to_csv(workbook.Sheets[sheet_name])
        if (excelWindow) {
          excelWindow.close()
        }
        createWindowTabWithData(data)
      })
    })
  })
}
