import electron from 'electron'
import { Application } from 'spectron'
const fakeDialog = require('spectron-fake-dialog')

export default {
  afterEach () {
    this.timeout(10000)

    if (this.app && this.app.isRunning()) {
      return this.app.stop()
    }
  },
  beforeEach () {
    this.timeout(10000)
    this.app = new Application({
      path: electron,
      args: ['dist/electron/main.js'],
      startTimeout: 10000,
      waitTimeout: 10000
    })
    fakeDialog.apply(this.app)
    return this.app.start()
    .then(() =>
      // 1 = Quit (No Cancel No save)
      fakeDialog.mock([ { method: 'showMessageBox', value: 1 } ])
    )
  }
}
