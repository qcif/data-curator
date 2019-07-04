import { remote } from 'electron'

export function globalBefore () {
  window._ = require('lodash')
}

export function globalStubTab (sandbox) {
  return sandbox.stub(remote, 'getGlobal')
    .withArgs('tab')
    .returns({ activeTitle: '', activeFilename: '', filenames: [] })
}

export function globalStubWindows (sandbox) {
  return sandbox.stub(remote, 'getGlobal')
    .withArgs('windows')
    .returns({})
}

export function globalStubMainWindows (sandbox) {
  return sandbox.stub(remote, 'getGlobal')
    .withArgs('windows')
    .returns({ home: 'home', errors: 'errors' })
}

// export function globalStubErrorWindow() {
//   return sinon.stub(remote, 'BrowserWindow')
//     .callsFake(function fakeFn() {
//       return 'bar';
//     })
// }

export function restoreRemoteGetGlobal () {
  remote.getGlobal.restore()
}
