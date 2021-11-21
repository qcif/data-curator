/**
 * Set `__static` path to static files in production
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-static-assets.html
 */
import { app, BrowserWindow, dialog, ipcMain as ipc, Menu } from 'electron'
import { createWindowTab, focusMainWindow } from './windows'
import { AppMenu } from './menu'
import './rendererToMain.js'
import './preferences.js'
import yargs_parser from 'yargs-parser'
import { createWindowTabFromFilename } from './file'
import _ from 'lodash'

let argv = yargs_parser(process.argv.slice(1))

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

// https://github.com/electron/electron/issues/15958: plist key: LSMultipleInstancesProhibited also stops app so allow multiple for Darwin and wait until solved in electron/chromium
if (process.platform !== 'darwin') {
  const hasLock = app.requestSingleInstanceLock()
  if (!hasLock) {
    console.error('Data curator is already open. Quitting this application.')
    app.quit()
  } else {
    app.on('second-instance', (event, commandLine, workingDirectory) => {
      // Someone tried to run a second instance, we should focus our window.
      console.error('Attempted to open a second instance. Disallowing...')
      focusMainWindow()
    })
  }
}

app.on('open-file', (event, path) => {
  argv._.push(path)
})

app.on('ready', () => {
  let appMenu = new AppMenu()
  Menu.setApplicationMenu(appMenu.menu)
  let browserWindow = createInitialWindow()
  // don't allow prompt in development as slows dev process down when trying to hot-reload
  if (process.env.NODE_ENV === 'production') {
    browserWindow.on('close', (event) => {
      promptBeforeCloseFunction(event, closeWindowNoPrompt, {
        message: 'Are you sure you want to quit?',
        title: 'Quit Data Curator',
        quitText: 'Quit'
      })
    })
  }
})

function createInitialWindow () {
  const clIndex = (process.env.NODE_ENV === 'development' || process.env.BABEL_ENV === 'test') ? 1 : 0
  // when there is a dialog that first comes up with message dialog (e.g., 'this is an application downloaded from the internet'), another non-string argument is present
  if (argv._.length > clIndex && _.isString(argv._[clIndex])) {
    return createWindowTabFromFilename(argv._[clIndex])
  }
  return createWindowTab()
}

function unlockSingleton () {
  app.releaseSingleInstanceLock()
}

function forceQuit () {
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
  forceQuit()
  event.returnValue = true
})

// This is needed as without it, production will still follow the darwin vs windows behaviour - dev env won't
app.on('window-all-closed', () => {
  // keep behaviour consistent - always close (no leaving app open with no windows in MacOSX)
  app.quit()
})

ipc.on('promptToSaveBeforeTabClose', (event, args) => {
  promptBeforeCloseFunction(event, closeTabDialog, {
    message: 'Are you sure you want to close this tab?',
    title: 'Close current tab',
    quitText: 'Close tab'
  }, args)
})

export function promptBeforeCloseFunction (event, closeFn, config, args) {
  event.preventDefault()
  let browserWindow = focusMainWindow()
  const response = dialog.showMessageBoxSync(browserWindow, {
    type: 'warning',
    buttons: [
      'Cancel', config.quitText
    ],
    defaultId: 0,
    title: config.title,
    message: `There may be unsaved work. ${config.message}`
  })
  if (response === 0) {
    return
  }
  closeFn(args)
}

export function closeTabDialog (args) {
  let browserWindow = focusMainWindow()
  browserWindow.webContents.send('okToCloseTab', args)
}

function closeWindowNoPrompt () {
  // ensure all windows are closed
  for (let browserWindow of BrowserWindow.getAllWindows()) {
    browserWindow.destroy()
  }
}
