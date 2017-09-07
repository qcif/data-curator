global.electron = require('electron')

global.BrowserWindow = electron.BrowserWindow
global.Dialog = electron.dialog

var showKeyboardHelp = function() {
  var showKeyboardHelp = new BrowserWindow({width: 760, height: 400})
  showKeyboardHelp.loadURL(`http://localhost:9080/#/keyboardhelp`)

  showKeyboardHelp.on('closed', function() {
    showKeyboardHelp = null
  })
}

module.exports = {
  showKeyboardHelp: showKeyboardHelp
}
