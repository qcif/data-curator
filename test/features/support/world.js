import { setWorldConstructor } from 'cucumber'
import { Application } from 'spectron'
import electron from 'electron'
// import fakeDialog from 'spectron-fake-dialog'
import chai from 'chai'
import chaiAsPromised from 'chai-as-promised'

chai.should()
chai.use(chaiAsPromised)

function CustomWorld ({attach, parameters}) {
  this.attach = attach
  this.parameters = parameters
  this.app = new Application({
    path: electron,
    args: ['dist/electron/main.js'],
    startTimeout: 10000,
    waitTimeout: 10000
    // webdriverLogPath: 'webdriver.log'
  })
  this.rowNumber = null
  this.colNumber = null
  this.openFileDialogReturned = ['stubbedFilenameForMenuSteps.txt']
  chaiAsPromised.transferPromiseness = this.app.transferPromiseness
}

setWorldConstructor(CustomWorld)
