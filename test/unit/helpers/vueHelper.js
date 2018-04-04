import Vue from 'vue'
import Vuex from 'vuex'
import modules from '../../../src/renderer/store/modules'
import Errors from '../../../src/renderer/components/Errors.vue'
import {shallow} from '@vue/test-utils'
import { remote, BrowserWindow } from 'electron'
Vue.use(Vuex)
Vue.directive('tooltip', function(el, binding) {
  // el.style.backgroundColor = binding.value
})

export function mountVuePageWithStore(page, storeFn) {
// export function mountVuePageWithStore(page) {
  const vm = new Vue({
    el: document.createElement('div'),
    render: p => p(page),
    store: new Vuex.Store(storeFn()),
    data: page.data,
    methods: page.methods
  })
  return vm
}

export function shallowMountErrors() {
  const errorsWrapper = shallow(Errors)
  return errorsWrapper
}

export function stubBrowserWindow(id, windowStub) {
  return sinon.stub(BrowserWindow, 'fromId')
    .withArgs(id)
    .returns(windowStub)
}
