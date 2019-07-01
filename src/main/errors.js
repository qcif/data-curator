import { focusOrNewSecondaryWindow, focusMainWindow, focusWindow } from './windows'

export function showErrors() {
  let browserWindow = focusOrNewSecondaryWindow('errors', { width: 760, height: 400 })
  focusMainWindow().webContents.send('getErrorMessages', browserWindow.id)
  // ensure errors window placed back in focus
  focusWindow('errors')
}
