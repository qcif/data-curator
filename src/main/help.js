import electron from 'electron'

import {BrowserWindow, dialog as Dialog} from 'electron'

function getKeyboardShorcutsMenu() {
  let helpMenu = Menu.getApplicationMenu().items.find(x => x.role === 'help')
  let keyboardShortcutsSubMenu = helpMenu.submenu.items.find(x => x.label === 'Keyboard Shortcuts')
  return keyboardShortcutsSubMenu
}

export function showKeyboardHelp() {
  let keyboardShortcutsSubMenu = getKeyboardShorcutsMenu()
  keyboardShortcutsSubMenu.enabled = false
  let keyboardHelpWindow = new BrowserWindow({width: 760, height: 400})
  keyboardHelpWindow.setMenu(null)
  keyboardHelpWindow.loadURL(`http://localhost:9080/#/keyboardhelp`)

  keyboardHelpWindow.on('closed', function() {
    keyboardShortcutsSubMenu.enabled = true
    keyboardHelpWindow = null
  })
}
