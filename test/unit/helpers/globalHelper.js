import {remote} from 'electron'

export function globalBefore() {
  window._ = require('lodash')
}

export function globalStubTab() {
  return sinon.stub(remote, 'getGlobal')
    .withArgs('tab')
    .returns({activeTitle: '', activeFilename: '', filenames: []})
}

export function restoreRemoteGetGlobal() {
  remote.getGlobal.restore()
}
