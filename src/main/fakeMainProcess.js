/**
 heavily borrowed from https://github.com/joe-re/spectron-fake-dialog
 **/

const { shell, ipcMain, BrowserWindow } = require('electron')

class FakeMain {
  parseArgs(window, options, callback, ...args) {
    if (window != null && window.constructor !== BrowserWindow) {
      [callback, options, window] = [options, window, null]
    }
    if ((callback == null) && typeof options === 'function') {
      [callback, options] = [options, null]
    }
    const lastArgument = args[args.length - 1]
    if ((callback == null) && typeof lastArgument === 'function') {
      callback = lastArgument
    }
    return [window, options, callback]
  }

  mockFunction (value, ...args) {
    const [window, options, callback] = this.parseArgs(...args)
    console.log(`options are: ${options}`)
    console.dir(options)
    console.log('callback is:')
    console.dir(callback)
    if (callback) {
      setTimeout(() => callback(value), 0)
      return
    }
    return value
  }
  fake (options, mainProcess) {
    options.forEach(v => {
      if (mainProcess[v.method]) {
        mainProcess[v.method] = this.mockFunction.bind(null, v.value)
      } else {
        throw new Error(`can't find ${v.method} on module.`)
      }
    })
  }
}

if (process.env.BABEL_ENV === 'test') {
  const faker = new FakeMain()
  ipcMain.on('SPECTRON_FAKE_SHELL/SEND', (e, options) => {
    console.log('received shell fake')
    faker.fake(options, shell)
    e.returnValue = true
  })
}
