import { setWorldConstructor } from 'cucumber'
import { Application } from 'spectron'
import electron from 'electron'
import chai from 'chai'
import chaiAsPromised from 'chai-as-promised'

chai.should()
chai.use(chaiAsPromised)

function CustomWorld ({ attach, parameters }) {
  this.attach = attach
  this.parameters = parameters
  if (!this.app) {
    this.app = createApp()
    this.openFileDialogReturned = ['stubbedFilenameForMenuSteps.txt']
    chaiAsPromised.transferPromiseness = this.app.transferPromiseness
  } else {
    console.log('WARNING: app already created...')
  }
}

function createApp () {
  return new Application({
    path: electron,
    args: ['dist/electron/main.js'],
    startTimeout: 2000,
    waitTimeout: 1000,
    quitTimeout: 1000,
    env: {
      ELECTRON_ENABLE_LOGGING: true,
      ELECTRON_ENABLE_STACK_DUMPING: true
    },
    webdriverLogPath: 'webdriver.log',
    chromeDriverArgs: ['remote-debugging-port=9222']
  })
}

setWorldConstructor(CustomWorld)
