import Home from '@/components/Home'
import flushPromises from 'flush-promises'
import { stubSimpleTabStore } from '../helpers/storeHelper.js'
import { createLocalVue, shallowMount } from '@vue/test-utils'
import { registerHotWithContainer, resetHot, stubHotRegisterActiveInstance } from '../helpers/hotHelper.js'
import { toolbarMenus } from '@/toolbarMenus.js'
import Vuex from 'vuex'
import { globalStubWindows } from '../helpers/globalHelper.js'
import { errorFeedback$ } from '@/rxSubject.js'
import { ipcRenderer as ipc } from 'electron'
import Vue from 'vue'

// Unfortunately Home.vue has become something of a God-object, which makes testing it painful
// (witnessed below by the boilerplate needed to silence imports/functions not included in tests.
// TODO: consider refactoring some methods into importable classes/vue-components

describe('Home.vue', function () {
  let sandbox
  describe('Toolbar menus', function () {
    let wrapper = null
    let hot = null
    let container = null
    beforeEach(function () {
      sandbox = sinon.createSandbox()
      Home.__Rewire__('getWindow', function (name) {
        return undefined
      })
      Home.__Rewire__('guessColumnProperties', function () {
        wrapper.setData({ messagesTitle: 'Guess success' })
      })
      Home.__Rewire__('getCurrentColumnIndexOrMin', function () {
        return undefined
      })
      Home.__Rewire__('reselectHotCell', function () {
        return undefined
      })
      const localVue = createLocalVue()
      localVue.use(Vuex)
      let store = new Vuex.Store(stubSimpleTabStore(hot))
      wrapper = shallowMount(Home, {
        store,
        localVue,
        attachToDocument: true
      })
      let container = wrapper.vm.$el.querySelector('#csvContent .editor')
      hot = registerHotWithContainer(container)
      stubHotRegisterActiveInstance(hot, sandbox)
      wrapper.setMethods({
        'updateDimensions': sandbox.stub(),
        'loadDataIntoLatestHot': sandbox.stub().withArgs().returns(hot.guid),
        'initHotTablePropertiesFromDescriptor': sandbox.stub(),
        'removePreviousHotComments': sandbox.stub(),
        'createZipPackage': sandbox.stub().callsFake(function fakeFn () {
          wrapper.setData({ messagesTitle: 'Export success' })
        }),
        'validateTable': sandbox.stub().callsFake(function fakeFn () {
          wrapper.setData({ messagesTitle: 'Validate success' })
        })
      })
    })

    afterEach(function () {
      Home.__ResetDependency__('getWindow')
      Home.__ResetDependency__('guessColumnProperties')
      Home.__ResetDependency__('getCurrentColumnIndexOrMin')
      Home.__ResetDependency__('reselectHotCell')
      wrapper.vm.$destroy()
      resetHot(sandbox)
      wrapper.destroy()
      wrapper = null
      hot = null
      sandbox.restore()
    })

    for (const menu of toolbarMenus) {
      it(`should show the relevant active button and navigation panel when ${menu.name} button is clicked.`, async () => {
        clickToolbarId(wrapper, menu.id)
        await Vue.nextTick()
        let clickedMenuName = wrapper.vm.$el.querySelector('#toolbar li.active').textContent
        clickedMenuName = clickedMenuName
          ? clickedMenuName.trim()
          : ''
        expect(clickedMenuName).to.equal(menu.name)
      })
    }
    it(`should have ${toolbarMenus.length} menus`, function () {
      const toolbarNumber = wrapper.vm.$el.querySelectorAll('#toolbar li').length
      expect(toolbarNumber).to.equal(toolbarMenus.length)
    })
  })

  describe('Hot comments', function () {
    let wrapper
    let hot
    beforeEach(function () {
      sandbox = sinon.createSandbox()
      Home.__Rewire__('getWindow', function (name, id) {
        return undefined
      })
      Home.__Rewire__('getCurrentColumnIndexOrMin', function () {
        return 0
      })
      Home.__Rewire__('reselectHotCell', function () {
        return undefined
      })
      const localVue = createLocalVue()
      localVue.use(Vuex)
      let store = new Vuex.Store(stubSimpleTabStore(hot))
      wrapper = shallowMount(Home, {
        store,
        localVue,
        attachToDocument: true,
        sync: false
      })
      let container = wrapper.vm.$el.querySelector('#csvContent .editor')
      hot = registerHotWithContainer(container)
      stubHotRegisterActiveInstance(hot, sandbox)
      globalStubWindows(sandbox)
      wrapper.setData({ currentHotId: hot.guid, previousComments: [] })
      wrapper.setMethods({
        'validateTable': sandbox.stub().callsFake(async function fakeFn () {
          await wrapper.vm.validateTableCore()
        })
      })
    })
    afterEach(function () {
      Home.__ResetDependency__('getWindow')
      Home.__ResetDependency__('getCurrentColumnIndexOrMin')
      Home.__ResetDependency__('validateActiveDataAgainstSchema')
      Home.__ResetDependency__('reselectHotCell')
      resetHot(sandbox)
      wrapper.destroy()
      wrapper = null
      hot = null
      for (const listener of ['guessColumnProperties', 'importDataPackage', 'validateTable', 'showErrorCell', 'getErrorMessages', 'hoverToSelectErrorCell', 'exitHoverToSelectErrorCell', 'triggerMenuButton', 'toggleActiveHeaderRow', 'addTab', 'addTabWithData', 'addTabWithFormattedData', 'addTabWithFormattedDataAndDescriptor', 'addTabWithFormattedDataFile', 'showSidePanel', 'saveDataSuccess', 'resized', 'showProvenanceErrors', 'closeAndshowLoadingScreen', 'closeLoadingScreen', 'resetPackagePropertiesToObject', 'importDataPackageFromFile', 'addSchemaToTabAndLock', 'okToCloseTab']) {
        ipc.removeAllListeners(listener)
      }
      sandbox.restore()
    })
    it('should trigger Comments when validation produces errors', async function () {
      expect(wrapper.vm.currentColumnIndex).to.equal(0)
      expect(wrapper.vm.messages).to.equal(false)
      Home.__Rewire__('validateActiveDataAgainstSchema', function (callback) {
        errorFeedback$.next(stubBasicErrorMessage1())
        callback()
      })
      await clickToolbarId(wrapper, 'validate-data')
      await flushPromises()
      const el = wrapper.vm.$el.querySelectorAll(`#csvContent .editor .ht_master table.htCore .htCommentCell`)
      expect(el.length).to.equal(1)
    })
    it('should NOT trigger Comments when validation produces NO errors', async function () {
      expect(wrapper.vm.currentColumnIndex).to.equal(0)
      expect(wrapper.vm.messages).to.equal(false)
      Home.__Rewire__('validateActiveDataAgainstSchema', function (callback) {
        callback()
      })
      await clickToolbarId(wrapper, 'validate-data')
      await flushPromises()
      const el = wrapper.vm.$el.querySelectorAll(`#csvContent .editor .ht_master table.htCore .htCommentCell`)
      expect(el.length).to.equal(0)
    })
  })
})

function stubBasicErrorMessage1 () {
  return {
    rowNumber: 1,
    columnNumber: 1,
    message: 'This is a test error',
    name: 'Test Error'
  }
}

function clickToolbarId (wrapper, id) {
  const el = wrapper.findAll('#toolbar li').filter(w => {
    return w.contains(`#${id}`)
  })
  if (el.length > 1) {
    throw new Error(`Should have found only 1 matching element, not ${el.length}`)
  }
  el.wrappers[0].trigger('click')
}
