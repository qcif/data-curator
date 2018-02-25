import {Application} from 'spectron'
import electron from 'electron'
import {After, Before} from 'cucumber'
import fakeDialog from 'spectron-fake-dialog'
import { expect, should, assert } from 'chai'
import { Given, When, Then} from 'cucumber'
import chai from 'chai'
import chaiAsPromised from 'chai-as-promised'
chai.should()
chai.use(chaiAsPromised)

After({timeout: 10000}, function () {
  if (this.app && this.app.isRunning()) {
    return this.app.stop()
  }
})

Before({timeout: 10000}, function () {
  this.rowNumber = null
  this.colNumber = null
  fakeDialog.apply(this.app)
  chaiAsPromised.transferPromiseness = this.app.transferPromiseness
  return this.app.start()
    .then(() => {
      // Auto-close message dialog : 1 = Quit (No Cancel No save)
      fakeDialog.mock([ { method: 'showMessageBox', value: 1 } ])
    })
})
