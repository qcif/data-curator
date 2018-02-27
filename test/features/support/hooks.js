import {Application} from 'spectron'
import electron from 'electron'
import {After, Before, Status, Given, When, Then} from 'cucumber'
import fakeDialog from 'spectron-fake-dialog'
import { expect, should, assert } from 'chai'
import chai from 'chai'
import chaiAsPromised from 'chai-as-promised'
import fs from 'fs'
chai.should()
chai.use(chaiAsPromised)

After({timeout: 10000}, async function (testCase) {
  if (testCase.result.status === Status.FAILED) {
    const imageBuffer = await this.app.browserWindow.capturePage()
    await this.attach(imageBuffer, 'image/png')
  }
  if (this.app && this.app.isRunning()) {
    // console.log('trying to check for screenshot and stop')
    await this.app.stop()
  }
})

Before({timeout: 10000}, function () {
  this.rowNumber = null
  this.colNumber = null
  fakeDialog.apply(this.app)
  chaiAsPromised.transferPromiseness = this.app.transferPromiseness
  return this.app.start()
    .then(function() {
      // Auto-close message dialog : 1 = Quit (No Cancel No save)
      fakeDialog.mock([ { method: 'showMessageBox', value: 1 } ])
    })
})
