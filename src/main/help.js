import {BrowserWindow} from 'electron'

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

  const winURL = process.env.NODE_ENV === 'development'
    ? `http://localhost:9080/keyboardhelp.html`
    : `file://${__dirname}/keyboardhelp.html`
  keyboardHelpWindow.loadURL(winURL)
  keyboardHelpWindow.on('closed', function () {
    keyboardShortcutsSubMenu.enabled = true
    keyboardHelpWindow = null
  })
}
