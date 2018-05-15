import { Application } from 'spectron'
import electron from 'electron'
import { After, Before, Status, Given, When, Then } from 'cucumber'
import fakeDialog from 'spectron-fake-dialog'
import { expect, should, assert } from 'chai'

After({timeout: 15000}, async function (testCase) {
  if (this.app && this.app.isRunning()) {
    if (testCase.result.status === Status.FAILED) {
      try {
        const imageBuffer = await this.app.browserWindow.capturePage()
        await this.attach(imageBuffer, 'image/png')
      } catch (error) {
        console.log('Unable to capture image', error)
      }
    }
    await this.app.stop()
  }
})

Before({timeout: 15000}, async function () {
  this.rowNumber = null
  this.colNumber = null
  this.pageTimeout = 5000
  fakeDialog.apply(this.app)
  await this.app.start()
  await this.app.client.waitUntilWindowLoaded()
  // Auto-close message dialog : 1 = Quit (No Cancel No save)
  fakeDialog.mock([{method: 'showMessageBox', value: 1}])
  fakeDialog.mock([{method: 'showOpenDialog', value: this.openFileDialogReturned}])
})
