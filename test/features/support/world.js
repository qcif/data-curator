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

// To turn on verbose logging for webdriverio: webdriverLogPath: 'webdriver.log',
function createApp () {
  return new Application({
    path: electron,
    args: ['dist/electron/main.js'],
    startTimeout: 20000,
    waitTimeout: 3000,
    quitTimeout: 5000,
    env: {
      ELECTRON_ENABLE_LOGGING: true,
      ELECTRON_ENABLE_STACK_DUMPING: true
    },
    chromeDriverArgs: ['remote-debugging-port=9222']
  })
}

setWorldConstructor(CustomWorld)
