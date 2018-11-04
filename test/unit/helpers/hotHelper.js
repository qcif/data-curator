import { HotRegister } from '@/hot.js'

let hotRegisterActiveQueryStub
let hotRegisterActiveInstanceStub
let hotElementClassName = 'stubbedHot'

export function stubHotInDocumentDom(sandbox) {
  resetDocument()
  stubDom()
  stubHotRegisterWithDefaultActiveQuery(sandbox)
}

function resetDocument() {
  document.open()
  document.write('<html><body></body></html>')
  document.close()
}

export function stubDom() {
  let hotView = document.createElement('div')
  hotView.setAttribute('class', hotElementClassName)
  document.body.appendChild(hotView)
}

export function stubHotRegisterWithDefaultActiveQuery(sandbox) {
  hotRegisterActiveQueryStub = sandbox.stub(HotRegister, 'activeQuery')
  hotRegisterActiveQueryStub.withArgs().returns(stubActiveQueryWithLast())
}

export function stubHotRegisterWithActiveQuery(sandbox, queryFn) {
  hotRegisterActiveQueryStub = sandbox.stub(HotRegister, 'activeQuery')
  hotRegisterActiveQueryStub.withArgs().returns(queryFn())
}

export function registerHot() {
  let container = stubActiveQueryWithLast()
  let hotId = HotRegister.register(container)
  let hot = HotRegister.getInstance(hotId)
  return hot
}

export function stubActiveQueryWithLast() {
  const allResults = document.querySelectorAll(`.${hotElementClassName}`)
  return allResults[allResults.length - 1]
}

export function stubActiveQueryWithFirst() {
  const allResults = document.querySelectorAll(`.${hotElementClassName}`)
  return allResults[0]
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

export function registerHotWithContainer(container) {
  let hotId = HotRegister.register(container)
  let hot = HotRegister.getInstance(hotId)
  return hot
}

export function stubHotRegisterActiveInstance(hot, sandbox) {
  hotRegisterActiveInstanceStub = sandbox.stub(HotRegister, 'getActiveInstance')
  hotRegisterActiveInstanceStub.withArgs().returns(hot)
}

export {
  hotRegisterActiveQueryStub
}
