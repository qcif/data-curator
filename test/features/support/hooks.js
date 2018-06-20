import { Application } from 'spectron'
import electron from 'electron'
import { After, Before, Status, Given, When, Then } from 'cucumber'
import fakeDialog from 'spectron-fake-dialog'
import { expect, should, assert } from 'chai'

async function stopAppRunning(app) {
  try {
    if (app && app.isRunning()) {
    // console.log('Attempting to stop app...')
      const result = await app.stop()
    }
    // this is just in case for slower OS/windows - catch any error and ignore
    if (app && app.electron) {
      const forceQuitResult = await this.app.electron.ipcRenderer.sendSync('forceQuit')
    // console.log(`force quit?`, result3)
    }
  } catch (error) {
    // console.log('error caught when stopping run. ignoring')
  }
}

After({timeout: 40000}, async function (testCase) {
  try {
    // console.log('Starting after hook....')
    if (testCase.result.status === Status.FAILED) {
      if (this.app && this.app.browserWindow) {
        const imageBuffer = await this.app.browserWindow.capturePage()
        await this.attach(imageBuffer, 'image/png')
        // console.log('got attachment in', attachResult)
      }
    }
    // stopAppRunning(this.app)
  } catch (error) {
    console.log('error in after hook', error)
  } finally {
    await stopAppRunning(this.app)
  }
})

Before({timeout: 20000}, async function (testCase) {
  try {
    // console.log('Starting before hook....')
    console.log(`Starting test scenario: ${testCase.pickle.name} in: ${testCase.sourceLocation.uri}`)
    // console.log(testCase.pickle.steps)
    this.rowNumber = null
    this.colNumber = null
    this.latestFilePath = null
    this.pageTimeout = 5000
    await fakeDialog.apply(this.app)
    await this.app.start()
    await this.app.client.waitUntilWindowLoaded()
    await this.app.electron.ipcRenderer.sendSync('unlockSingleton')
    await this.app.client.browserWindow.focus()
    const result = await this.app.client.browserWindow.isFocused()
    await this.app.electron.ipcRenderer.sendSync('SPECTRON_FAKE_DIALOG/SEND', [{method: 'showMessageBox', value: 1}])
    await this.app.electron.ipcRenderer.sendSync('SPECTRON_FAKE_DIALOG/SEND', [{method: 'showOpenDialog', value: this.openFileDialogReturned}])
  } catch (error) {
    console.log('error in before hook', error)
    await stopAppRunning(this.app)
  }
})
