import Vue from 'vue'
Vue.config.devtools = false
Vue.config.productionTip = false

//use sinonTest in files wish to use it to choose over sandbox
// const sinonTest = require('sinon-test')(sinon, {useFakeTimers: false})
// global.sinonTest = sinonTest
var sinonChai = require('sinon-chai')
sinon.config = {
  useFakeTimers: false
}
// const sinonTest = require('sinon-test')(sinon)
// global.sinonTest = sinonTest
chai.use(sinonChai)

// require all test files (files that ends with .spec.js)
const testsContext = require.context('./specs', true, /\.spec/)
testsContext.keys().forEach(testsContext)

// require all src files except main.js for coverage.
// you can also change this to match only the subset of files that
// you want coverage for.
const srcContext = require.context('../../src/renderer', true, /^\.\/(?!main(\.js)?$)/)
srcContext.keys().forEach(srcContext)
