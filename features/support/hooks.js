var Application = require('spectron').Application
var electron = require('electron')
var { After, Before } = require('cucumber')
var fakeDialog = require('spectron-fake-dialog')

After({timeout: 10000}, function () {
  if (this.app && this.app.isRunning()) {
    return this.app.stop()
  }
})

Before({timeout: 10000}, function () {
  fakeDialog.apply(this.app)
  return this.app.start()
    .then(() =>
      // Auto-close message dialog : 1 = Quit (No Cancel No save)
      fakeDialog.mock([ { method: 'showMessageBox', value: 1 } ])
    )
})
