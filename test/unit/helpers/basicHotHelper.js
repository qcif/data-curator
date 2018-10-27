import { HotRegister } from '@/hot.js'

let hotRegisterActiveQueryStub
let hotRegisterActiveInstanceStub
let hotElementClassName = 'stubbedHot'

export function stubHotInDocumentDom(sandbox) {
  resetDocument()
  stubDom()
  stubHotRegisterActiveQuery(sandbox)
}

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

function stubHotRegisterActiveQuery(sandbox) {
  hotRegisterActiveQueryStub = sandbox.stub(HotRegister, 'activeQuery')
  hotRegisterActiveQueryStub.withArgs().returns(stubActiveQuery())
}

function stubActiveQuery() {
  return document.querySelectorAll(`.${hotElementClassName}`)[0]
}

export function resetHot(sandbox) {
  HotRegister.destroyAllHots()
  if (!sandbox) {
    if (hotRegisterActiveQueryStub) {
      hotRegisterActiveQueryStub.restore()
    }
    if (hotRegisterActiveInstanceStub) {
      hotRegisterActiveInstanceStub.restore()
    }
  }
}

export function registerHot() {
  let container = stubActiveQuery()
  let hotId = HotRegister.register(container)
  let hot = HotRegister.getInstance(hotId)
  return hot
}

export function registerHotWithContainer(container) {
  let hotId = HotRegister.register(container)
  let hot = HotRegister.getInstance(hotId)
  return hot
}

export function stubHotRegisterActiveInstance(hot, sandbox) {
  hotRegisterActiveInstanceStub = sandbox.stub(HotRegister, 'getActiveInstance')
  hotRegisterActiveInstanceStub.withArgs().returns(hot)
}
