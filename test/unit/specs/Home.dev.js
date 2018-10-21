import Home from '@/components/Home'
import { stubSimpleTabStore } from '../helpers/storeHelper.js'
import { rightSideNavStyle, leftSideNavStyle, footerMsgStyle, navPanelType } from '../helpers/domHelper.js'
import { createLocalVue, shallowMount, mount } from '@vue/test-utils'
import { registerHotWithContainer, resetHot, stubHotRegisterActiveInstance } from '../helpers/basicHotHelper.js'
import { toolbarMenus } from '@/toolbarMenus.js'
import Vuex from 'vuex'
import { shallowMountErrors } from '../helpers/vueHelper.js'
import { globalStubWindows, globalStubMainWindows, restoreRemoteGetGlobal } from '../helpers/globalHelper.js'
describe('Home.vue', () => {
  // dummmy test to begin with to incorporate vue/html with existing framework
  describe('Toolbar menus', () => {
    let wrapper
    let hot
    beforeEach(() => {
      const localVue = createLocalVue()
      localVue.use(Vuex)
      let store = new Vuex.Store(stubSimpleTabStore(hot))
      wrapper = shallowMount(Home, { store, localVue, attachToDocument: true })
      let container = wrapper.vm.$el.querySelector('#csvContent .editor')
      hot = registerHotWithContainer(container)
      stubHotRegisterActiveInstance(hot)
      globalStubWindows()

      Home.__Rewire__('guessColumnProperties', function() {
        wrapper.setData({ messagesTitle: 'Guess success' })
      })
      wrapper.setMethods({
        'updateDimensions': sinon.stub(),
        'loadDataIntoLatestHot': sinon.stub().withArgs().returns(hot.guid),
        'initHotTablePropertiesFromDescriptor': sinon.stub(),
        'removePreviousHotComments': sinon.stub(),
        'createPackage': sinon.stub().callsFake(function fakeFn() {
          wrapper.setData({ messagesTitle: 'Export success' })
        }),
        'validateTable': sinon.stub().callsFake(function fakeFn() {
          wrapper.setData({ messagesTitle: 'Validate success' })
        })
      })
    })
    afterEach(() => {
      resetHot()
      wrapper.vm.$destroy()
      wrapper = null
      hot = null
      restoreRemoteGetGlobal()
    })

    toolbarMenus.forEach(menu => {
      it(`should show the relevant active button and navigation panel when ${menu.name} button is clicked.`, () => {
        let el = wrapper.findAll('#toolbar li').filter(w => {
          return w.contains(`#${menu.id}`)
        })
        if (el.length > 1) {
          throw new Error(`Should have found only 1 matching element, not ${el.length}`)
        }
        el.wrappers[0].trigger('click')
        let clickedMenuName = wrapper.vm.$el.querySelector('#toolbar li.active').textContent
        clickedMenuName = clickedMenuName
          ? clickedMenuName.trim()
          : ''
        expect(clickedMenuName).to.equal(menu.name)

        const rightNavPanel = wrapper.find(rightSideNavStyle)
        const leftNavPanel = wrapper.find(leftSideNavStyle)
        const footerMsgPanel = wrapper.find(footerMsgStyle)

        if (rightNavPanel.exists()) {
          // check panel title is correct
          expect(rightNavPanel.text().trim()).to.include(menu.name)
          // check panel acutally belongs to the correct type (right, left, bottom)
          expect(navPanelType[rightSideNavStyle]).to.include(menu.name)
        } else if (leftNavPanel.exists()) {
          expect(leftNavPanel.text().trim()).to.include(menu.name)
          expect(navPanelType[leftSideNavStyle]).to.include(menu.name)
        } else {
          expect(footerMsgPanel.text().trim()).to.include(menu.name)
          expect(navPanelType[footerMsgStyle]).to.include(menu.name)
        }
      })
    })
    it(`should have ${toolbarMenus.length} menus`, () => {
      const toolbarNumber = wrapper.vm.$el.querySelectorAll('#toolbar li').length
      expect(toolbarNumber).to.equal(toolbarMenus.length)
    })
  })

  describe('Hot comments', () => {
    let wrapper
    let hot
    beforeEach(() => {
      const localVue = createLocalVue()
      localVue.use(Vuex)
      let store = new Vuex.Store(stubSimpleTabStore(hot))
      wrapper = shallowMount(Home, { store, localVue, attachToDocument: true })
      let container = wrapper.vm.$el.querySelector('#csvContent .editor')
      hot = registerHotWithContainer(container)
      stubHotRegisterActiveInstance(hot)
      globalStubMainWindows()
    })
    afterEach(() => {
      resetHot()
      wrapper.vm.$destroy()
      wrapper = null
      hot = null
      restoreRemoteGetGlobal()
    })
    it('should trigger Comments when messages type equals error', sinonTest(async function() {
      expect(wrapper.vm.currentColumnIndex).to.equal(0)
      expect(wrapper.vm.messages).to.equal(false)
      let errorsWrapper = shallowMountErrors()
      // let messages = stubBasicErrorMessage1()
      // wrapper.setData({ messagesTitle: 'Validation Errors', messagesType: 'error', messages: messages })
      // await flushPromises()
      // const el = wrapper.findAll(`#csvContent .editor .ht_master table.htCore tr:nth-of-type(1) td:nth-of-type(1).htCommentCell`)
      // expect(el.length).to.equal(1)
    }))
    // it('should NOT trigger Comments when messages type does NOT equal error', sinonTest(async function() {
    //   expect(wrapper.vm.currentColumnIndex).to.equal(0)
    //   expect(wrapper.vm.messages).to.equal(false)
    //   this.stub(HotRegister, 'getActiveInstance').returns(hot)
    //   let messages = stubBasicErrorMessage1()
    //   wrapper.setData({ messagesTitle: 'Validation Errors', messagesType: 'foo', messages: messages })
    //   await flushPromises()
    //   const el = wrapper.findAll(`#csvContent .editor .ht_master table.htCore tr:nth-of-type(1) td:nth-of-type(1).htCommentCell`)
    //   expect(el.length).to.equal(0)
    // }))
  })
})

function stubBasicErrorMessage1() {
  return [
    {
      rowNumber: 1,
      columnNumber: 1,
      message: 'This is a test error',
      name: 'Test Error'
    }
  ]
}
