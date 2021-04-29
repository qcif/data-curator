const { contextBridge, ipcRenderer } = require('electron')

const validChannels = ['getProcessEnv', 'sendProcessEnv']
console.log(`env is ${process.env.NODE_ENV}`)
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
    on: (channel, func) => {
      if (validChannels.includes(channel)) {
        // Strip event as it includes `sender` and is a security risk
        ipcRenderer.on(channel, (event, ...args) => func(...args))
      }
    }
  }
)
