import {setWorldConstructor} from 'cucumber'
import {Application} from 'spectron'
import electron from 'electron'

function CustomWorld({attach, parameters}) {
  this.attach = attach
  this.parameters = parameters
  this.app = new Application({
    path: electron,
    args: ['dist/electron/main.js'],
    startTimeout: 10000,
    waitTimeout: 10000
  })
  this.rowNumber = null
  this.colNumber = null
}

setWorldConstructor(CustomWorld)
