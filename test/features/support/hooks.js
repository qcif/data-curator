import { After, Before, Status } from 'cucumber'
import fakeDialog from 'spectron-fake-dialog'
import { exec } from 'child_process'
import { applyMock } from './page-objects/mockMainProcess'

async function stopAppRunning (app) {
  try {
    if (app && app.isRunning()) {
    // console.log('Attempting to stop app...')
      await app.stop()
    }
    // this is just in case for slower OS/windows - catch any error and ignore
    if (app && app.electron) {
      await this.app.electron.ipcRenderer.sendSync('forceQuit')
    }
  } catch (error) {
    // console.log('error caught when stopping run. ignoring')
  }
}

function tallyTestAppveyor (testCase) {
  if (process.env.APPVEYOR) {
    console.log('appveyor tally...')
    exec(`appveyor AddTest -Name ${testCase.pickle.name} -Framework Spectron -Filename ${testCase.sourceLocation.uri} -Outcome ${testCase.result.status} -Duration ${testCase.result.duration}`, (error, stdout, stderr) => {
      if (error) {
        console.error(`exec error: ${error}`)
        return
      }
      console.log(`stdout: ${stdout}`)
      console.log(`stderr: ${stderr}`)
    })
  }
}

After({ timeout: 40000 }, async function (testCase) {
  try {
    if (testCase.result.status === Status.FAILED) {
      if (this.app && this.app.browserWindow) {
        const imageBuffer = await this.app.browserWindow.capturePage()
        await this.attach(imageBuffer, 'image/png')
        // console.log('got attachment in', attachResult)
      }
    }
    tallyTestAppveyor(testCase)
  } catch (error) {
    console.log('error in after hook', error)
  } finally {
    await stopAppRunning(this.app)
  }
})

Before({ timeout: 20000 }, async function (testCase) {
  try {
    // console.log('Starting before hook....')
    console.log(`Starting test scenario: ${testCase.pickle.name} in: ${testCase.sourceLocation.uri}`)
    // console.log(testCase.pickle.steps)
    this.rowNumber = null
    this.colNumber = null
    this.latestFilePath = null
    this.pageTimeout = 8000
    this.pageShortTimeout = 1000
    await fakeDialog.apply(this.app)
    await applyMock(this.app)
    await this.app.start()
    await this.app.client.waitUntilWindowLoaded()
    await this.app.electron.ipcRenderer.sendSync('unlockSingleton')
    await this.app.client.browserWindow.focus()
    await this.app.client.browserWindow.isFocused()
    await this.app.electron.ipcRenderer.sendSync('SPECTRON_FAKE_DIALOG/SEND', [{ method: 'showMessageBox', value: 1 }])
    await this.app.electron.ipcRenderer.sendSync('SPECTRON_FAKE_DIALOG/SEND', [{ method: 'showOpenDialog', value: this.openFileDialogReturned }])
    // browser.expectRequest(method, url, statusCode)
    // await this.app.electron.ipcRenderer.sendSync('SPECTRON_FAKE_SHELL/SEND', [{ method: 'openExternal', value: createPromise() }])
  } catch (error) {
    console.log('error in before hook', error)
    await stopAppRunning(this.app)
  }
})
