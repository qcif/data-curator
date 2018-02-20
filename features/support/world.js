var { setWorldConstructor } = require('cucumber')
var Application = require('spectron').Application
var electron = require('electron')

// setWorldConstructor(function () {
//   this.app = new Application({
//     path: electron,
//     args: ['dist/electron/main.js'],
//     startTimeout: 10000,
//     waitTimeout: 10000
//   })
// })

// function CustomWorld() {
//   this.app = new Application({
//     path: electron,
//     args: ['dist/electron/main.js'],
//     startTimeout: 10000,
//     waitTimeout: 10000
//   })
// }
//
// setWorldConstructor(CustomWorld)
