import Vue from 'vue'
import Vuex from 'vuex'
import Errors from '../../../src/renderer/components/Errors.vue'
import { shallowMount } from '@vue/test-utils'
import { BrowserWindow } from 'electron'
Vue.use(Vuex)

export function mountVuePageWithStore(page, storeFn) {
  const vm = new Vue({
    el: document.createElement('div'),
    data: page.data,
    methods: page.methods,
    render: p => p(page),
    store: new Vuex.Store(storeFn())
  })
  return vm
}

export function shallowMountErrors() {
  const errorsWrapper = shallowMount(Errors)
  return errorsWrapper
}

export function stubBrowserWindow(id, windowStub) {
  return sinon.stub(BrowserWindow, 'fromId')
    .withArgs(id)
    .returns(windowStub)
}
