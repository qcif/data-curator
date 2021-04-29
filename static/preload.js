const { contextBridge, ipcRenderer } = require('electron')

const validChannels = ['getProcessEnv', 'sendProcessEnv']
contextBridge.exposeInMainWorld(
  'ipc', {
    send: (channel, data) => {
      if (validChannels.includes(channel)) {
        ipcRenderer.send(channel, data)
      }
    },
    sendSync: (channel, data) => {
      if (validChannels.includes(channel)) {
        ipcRenderer.sendSync(channel, data)
      }
    },
    on: (channel, listener) => {
      if (validChannels.includes(channel)) {
        // Strip event as it includes `sender` and is a security risk
        ipcRenderer.on(channel, (event, ...args) => listener(...args))
        // ipcRenderer.on(channel, listener)
      }
    }
  }
)
