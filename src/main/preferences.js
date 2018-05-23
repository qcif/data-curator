import settings from 'electron-settings'
import {ipcMain as ipc} from 'electron'
import _ from 'lodash'

ipc.on('getPreference', (event, arg) => {
  console.log(`arg is`, arg)
  // const preference = ''
  const preference = settings.get(arg)
  event.returnValue = preference || ''
})

ipc.on('setPreference', (event, name, stringified) => {
  console.log('in setter, name is', name)
  console.log('stringified is', stringified)
  console.log(JSON.parse(stringified))
  // if (name && !_.isEmpty(stringified)) {

  settings.set(name, JSON.parse(stringified))
  // }
  // event.returnValue = true
})

ipc.on('removePreference', (event, name) => {
  console.log('in setter, removing name is', name)
  settings.delete(name)
})
