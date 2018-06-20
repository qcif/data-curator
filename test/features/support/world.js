import { setWorldConstructor } from 'cucumber'
import { Application } from 'spectron'
import electron from 'electron'
import chai from 'chai'
import chaiAsPromised from 'chai-as-promised'

chai.should()
chai.use(chaiAsPromised)

function CustomWorld ({attach, parameters}) {
  // console.log('starting world...')
  this.attach = attach
  this.parameters = parameters
  if (!this.app) {
    this.app = createApp()
    this.hotParentSelector = '.tab-pane.active .editor.handsontable'
    this.openFileDialogReturned = ['stubbedFilenameForMenuSteps.txt']
    chaiAsPromised.transferPromiseness = this.app.transferPromiseness
  } else {
    console.log('WARNING: app already created...')
  }
  // console.log(`at world`)
  // console.log(this)
}

function createApp() {
  return new Application({
    path: electron,
    args: ['dist/electron/main.js'],
    startTimeout: 10000,
    waitTimeout: 10000,
    quitTimeout: 5000,
    env: {
      ELECTRON_ENABLE_LOGGING: true,
      ELECTRON_ENABLE_STACK_DUMPING: true
    },
    webdriverLogPath: 'webdriver.log'
  })
}

setWorldConstructor(CustomWorld)
