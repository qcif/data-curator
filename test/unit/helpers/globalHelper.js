import {remote, BrowserWindow} from 'electron'

export function globalBefore() {
  window._ = require('lodash')
}

export function globalStubTab() {
  return sinon.stub(remote, 'getGlobal')
    .withArgs('tab')
    .returns({activeTitle: '', activeFilename: '', filenames: []})
}

// export function globalStubWindows() {
//   return sinon.stub(remote, 'getGlobal')
//     .withArgs('windows')
//     .returns({home: 'home', errors: 'errors'})
// }

// export function globalStubErrorWindow() {
//   return sinon.stub(remote, 'BrowserWindow')
//     .callsFake(function fakeFn() {
//       return 'bar';
//     })
// }

export function restoreRemoteGetGlobal() {
  remote.getGlobal.restore()
}
