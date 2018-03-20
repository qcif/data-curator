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
  keyboardHelpWindow.setMenu(null)

  const winURL = process.env.NODE_ENV === 'development'
    ? `http://localhost:9080/keyboardhelp.html`
    : `file://${__dirname}/keyboardhelp.html`
  keyboardHelpWindow.loadURL(winURL)
  keyboardHelpWindow.on('closed', function () {
    keyboardShortcutsSubMenu.enabled = true
    keyboardHelpWindow = null
  })
}
