electron = require('electron')

BrowserWindow = electron.BrowserWindow
Dialog = electron.dialog
Menu = electron.Menu

function getKeyboardShorcutsMenu() {
  let helpMenu = Menu.getApplicationMenu().items.find(x => x.role === 'help')
  let keyboardShortcutsSubMenu = helpMenu.submenu.items.find(x => x.label === 'Keyboard Shortcuts')
  return keyboardShortcutsSubMenu
}

var showKeyboardHelp = function() {
  let keyboardShortcutsSubMenu = getKeyboardShorcutsMenu()
  keyboardShortcutsSubMenu.enabled = false
  var keyboardHelpWindow = new BrowserWindow({width: 760, height: 400})

  keyboardHelpWindow.loadURL(`http://localhost:9080/#/keyboardhelp`)
  keyboardHelpWindow.on('closed', function() {
    keyboardShortcutsSubMenu.enabled = true
    showKeyboardHelp = null
  })
}

module.exports = {
  showKeyboardHelp: showKeyboardHelp
}
