import {HotRegister} from '@/hot.js'
import sinon from 'sinon'
sinon.config = {
  useFakeTimers: false
}

let globalStub
let hotRegisterActiveQueryStub
let items = {
  tab: {
    activeTitle: '',
    activeFilename: '',
    filenames: []
  }
}
let hotElementClassName = 'stubbedHot'

function resetDocument() {
  document.open()
  document.write('<html><body></body></html>')
  document.close()
}

function stubDom() {
  let hotView = document.createElement('div')
  hotView.setAttribute('class', hotElementClassName)
  document.body.appendChild(hotView)
}

function stubActiveQuery() {
  return document.querySelectorAll(`.${hotElementClassName}`)[0]
}

function stubHotRegisterActiveQuery() {
  hotRegisterActiveQueryStub = sinon.stub(HotRegister, 'activeQuery')
  hotRegisterActiveQueryStub.withArgs().returns(stubActiveQuery())
}

before(function() {
  window._ = require('lodash')
})

beforeEach(() => {
  resetDocument()
  stubDom()
  stubHotRegisterActiveQuery()
})

function registerHot() {
  let container = stubActiveQuery()
  let hotId = HotRegister.register(container)
  let hot = HotRegister.getInstance(hotId)
  return hot
}

let globalStubTab = () => {
  globalStub = sinon.stub(remote, 'getGlobal')
  globalStub.withArgs('tab').returns({activeTitle: '', activeFilename: '', filenames: []})
}

afterEach(() => {
  HotRegister.destroyAllHots()
  hotRegisterActiveQueryStub.restore()
})
