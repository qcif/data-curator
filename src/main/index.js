/**
 * Set `__static` path to static files in production
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-static-assets.html
 */
import { app, Menu, BrowserWindow, dialog, ipcMain as ipc } from 'electron'
import { createWindowTab, focusMainWindow } from './windows'
import { AppMenu } from './menu'
import './rendererToMain.js'
import './preferences.js'

if (process.env.NODE_ENV !== 'development') {
  global.__static = require('path').join(__dirname, '/static').replace(/\\/g, '\\\\')
  global.version = app.getVersion()
} else {
  global.version = require('../../package.json').version
}

global.tab = {
  activeTitle: '',
  activeFilename: '',
  filenames: [],
  activeHotId: ''
}
global.windows = {}

const isSecondInstance = app.makeSingleInstance((commandLine, workingDirectory) => {
  // Someone tried to run a second instance, we should focus our window.
  console.error('Attempted to open a second instance. Disallowing...')
  focusMainWindow()
})

if (isSecondInstance) {
  console.error('Data curator is already open. Quitting this application.')
  app.quit()
}

app.on('ready', () => {
  let appMenu = new AppMenu()
  Menu.setApplicationMenu(appMenu.menu)
  let browserWindow = createWindowTab()
  // don't allow prompt in development as slows dev process down when trying to hot-reload
  if (process.env.NODE_ENV === 'production') {
    browserWindow.on('close', (event) => {
      quitDialog(event, closeWindowNoPrompt)
    })
  }
})

function unlockSingleton() {
  app.releaseSingleInstance()
}

function forceQuit() {
  app.exit(5)
}

ipc.on('unlockSingleton', (event, arg) => {
  try {
    unlockSingleton()
    // if (returned) {
    event.returnValue = true
    // }
  } catch (error) {
    throw (error)
  }
})

ipc.on('forceQuit', (event, arg) => {
  try {
    forceQuit()
    event.returnValue = true
  } catch (error) {
    throw (error)
  }
})

// This is needed as without it, production will still follow the darwin vs windows behaviour - dev env won't
app.on('window-all-closed', () => {
  // keep behaviour consistent - always close (no leaving app open with no windows in MacOSX)
  app.quit()
})

export function quitDialog(event, callback) {
  event.preventDefault()
  let browserWindow = focusMainWindow()
  dialog.showMessageBox(browserWindow, {
    type: 'warning',
    buttons: [
      'Cancel', 'Quit'
    ],
    defaultId: 0,
    title: 'Quit Application',
    message: 'There may be unsaved work. Are you sure you want to quit?'
  }, function(response) {
    if (response === 0) {
      return
    }
    callback()
  })
}

export function quitOrSaveDialog(event, endButtonName, callback) {
  event.preventDefault()
  let browserWindow = focusMainWindow()
  dialog.showMessageBox(browserWindow, {
    type: 'warning',
    buttons: [
      'Cancel', endButtonName, 'Save'
    ],
    defaultId: 0,
    title: 'Save current tab before close?',
    message: 'Save current tab before close?'
  }, function(response) {
    if (response === 0) {
      return
    }
    if (response === 1) {
      callback()
    } else {
      dialog.showSaveDialog({}, function(filename) {
        if (filename === undefined) {
          return
        }
        saveAndExit(callback, filename)
      })
    }
  })
}

async function saveAndExit(callback, filename) {
  try {
    let browserWindow = focusMainWindow()
    await browserWindow.webContents.send('saveData', browserWindow.format, filename)
    callback()
  } catch (err) {
    console.error(err)
  }
}

function closeWindowNoPrompt(result) {
  // ensure all windows are closed
  for (let browserWindow of BrowserWindow.getAllWindows()) {
    browserWindow.destroy()
  }
}
/**
 * Auto Updater
 *
 * Uncomment the following code below and install `electron-updater` to
 * support auto updating. Code Signing with a valid certificate is required.
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-electron-builder.html#auto-updating
 */

/*
import { autoUpdater } from 'electron-updater'

autoUpdater.on('update-downloaded', () => {
  autoUpdater.quitAndInstall()
})

app.on('ready', () => {
  if (process.env.NODE_ENV === 'production') autoUpdater.checkForUpdates()
})
 */
