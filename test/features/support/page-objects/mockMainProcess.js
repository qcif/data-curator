import path from 'path'

let _app = null
export function applyMock (app) {
  _app = app
  _app.args.unshift(path.join(__dirname, '../../../../src/main/fakeMainProcess.js'))
  _app.args.unshift('--require')
  return _app
}

export function mockShell (options) {
  console.log('sending call to mock...')
  const value = _app.electron.ipcRenderer.sendSync('SPECTRON_FAKE_SHELL/SEND', options)
  return value
}
