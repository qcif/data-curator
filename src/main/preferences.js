import settings from 'electron-settings'
import {ipcMain as ipc} from 'electron'
import _ from 'lodash'

ipc.on('getPreference', (event, arg) => {
  const preference = settings.get(arg)
  event.returnValue = preference || ''
})

ipc.on('setPreference', (event, name, stringified) => {
  settings.set(name, JSON.parse(stringified))
})

ipc.on('removePreference', (event, name) => {
  settings.delete(name)
})
