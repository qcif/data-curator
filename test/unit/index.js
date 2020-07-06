import Vue from 'vue'

// require globally for modules such as tableschema-js
import "regenerator-runtime/runtime.js"

Vue.config.devtools = false
Vue.config.productionTip = false

// sandbox preferred over sinonTest, so that can set up in hooks, rather than in tests.
// const sinonTest = require('sinon-test')(sinon, {useFakeTimers: false})
// global.sinonTest = sinonTest
var sinonChai = require('sinon-chai')
sinon.config = {
  useFakeTimers: false
}
chai.use(sinonChai)

// require all test files (files that ends with .spec.js)
const testsContext = require.context('./specs', true, /\.(dev|spec)/)
// const testsContext = require.context('./specs', true, /\.(dev)/)
testsContext.keys().forEach(testsContext)

// require all src files except main.js for coverage.
// you can also change this to match only the subset of files that
// you want coverage for.
const srcContext = require.context('../../src/renderer', true, /^\.\/(?!main(\.js)?$)/)
srcContext.keys().forEach(srcContext)
