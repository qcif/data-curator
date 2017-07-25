import {BrowserWindow} from 'electron'
import {XLSX} from 'xlsx'

export function importExcel() {
  global.Dialog.showOpenDialog({
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

    var popup = new BrowserWindow({width: 300, height: 150})
    popup.loadURL(`http://localhost:9080/#/selectworksheet`)
    popup.webContents.on('did-finish-load', function() {
      popup.webContents.send('loadSheets', workbook.SheetNames)

      global.ipc.once('worksheetSelected', function(e, sheet_name) {
        let data = XLSX.utils.sheet_to_csv(workbook.Sheets[sheet_name])
        popup.close()
        global.utils.createWindow(data)
      })

      global.ipc.once('worksheetCanceled', function() {
        popup.close()
      })
    })

    popup.on('closed', function() {
      popup = null
    })
  })
}
