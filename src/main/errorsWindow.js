import {BrowserWindow} from 'electron'
import {getErrorsWindow} from './utils'

export function showErrorsWindow() {
  let errorsWindow = getErrorsWindow()
  errorsWindow.setMenu(null)
  const winURL = process.env.NODE_ENV === 'development'
    ? `http://localhost:9080/errors.html`
    : `file://${__dirname}/errors.html`
  errorsWindow.loadURL(winURL)
  errorsWindow.on('show', function () {
    global.errorsWindowId = errorsWindow.id
  })
  errorsWindow.on('closed', function () {
    if (errorsWindow) {
      errorsWindow = null
    }
  })
}
