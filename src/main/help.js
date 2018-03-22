import {BrowserWindow, Menu} from 'electron'
import {getKeyboardHelpWindow} from './utils'

function getKeyboardShorcutsMenu() {
  let helpMenu = Menu.getApplicationMenu().items.find(x => x.role === 'help')
  let keyboardShortcutsSubMenu = helpMenu.submenu.items.find(x => x.label === 'Keyboard Shortcuts')
  return keyboardShortcutsSubMenu
}

export function showKeyboardHelp() {
  let keyboardShortcutsSubMenu = getKeyboardShorcutsMenu()
  keyboardShortcutsSubMenu.enabled = false
  let keyboardHelpWindow = getKeyboardHelpWindow()
  keyboardHelpWindow.on('show', function () {
    global.keyboardHelpWindowId = keyboardHelpWindow.id
  })
  keyboardHelpWindow.on('closed', function () {
    keyboardShortcutsSubMenu.enabled = true
  })
}
