import { focusOrNewSecondaryWindow } from './windows'
import { getSubMenuFromMenu } from './menuUtils.js'

export function showKeyboardHelp () {
  let shortcutsSubMenu = getSubMenuFromMenu('Help', 'Keyboard Shortcuts')
  shortcutsSubMenu.enabled = false
  let browserWindow = focusOrNewSecondaryWindow('keyboardhelp', { width: 760, height: 400 })
  browserWindow.on('closed', function () {
    shortcutsSubMenu.enabled = true
  })
}
