var Application = require('spectron').Application
var electron = require('electron')
var { After, Before } = require('cucumber')
var fakeDialog = require('spectron-fake-dialog')

process.env.BABEL_ENV = 'test'

// Enable use of ES6+ on required files
require('babel-register')({
  ignore: /node_modules/
})

After({timeout: 10000}, function () {
  if (this.app && this.app.isRunning()) {
    return this.app.stop()
  }
})

Before({timeout: 10000}, function () {
  // this.app = new Application({
  //   path: electron,
  //   args: ['dist/electron/main.js'],
  //   startTimeout: 10000,
  //   waitTimeout: 10000
  // })
  // fakeDialog.apply(this.app)
  // return this.app.start()
  //   .then(() =>
  //   // 1 = Quit (No Cancel No save)
  //     fakeDialog.mock([ { method: 'showMessageBox', value: 1 } ])
  //   )
})
