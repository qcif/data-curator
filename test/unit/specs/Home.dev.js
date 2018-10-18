import Home from '@/components/Home'
import { stubSimpleTabStore } from '../helpers/storeHelper.js'
import { mount, createLocalVue } from '@vue/test-utils'
import { registerHotWithContainer, resetHot, stubHotRegisterActiveInstance } from '../helpers/basicHotHelper.js'
import Vuex from 'vuex'

describe('Home.vue', () => {
  // dummmy test to begin with to incorporate vue/html with existing framework
  describe('Home.vue toolbar menus', () => {
    // let vm
    // beforeEach(() => {
    //   vm = mountVuePageWithStore(Home, stubSimpleTabStore).$mount()
    // })
    // afterEach(() => {
    //   vm.$destroy()
    // })
    let wrapper
    let hot
    beforeEach(() => {
      const localVue = createLocalVue()
      localVue.use(Vuex)
      let store = new Vuex.Store(stubSimpleTabStore(hot))
      wrapper = mount(Home, {
        store,
        localVue,
        attachToDocument: true
      })
      let container = wrapper.vm.$el.querySelector('#csvContent .editor')
      hot = registerHotWithContainer(container)
      stubHotRegisterActiveInstance(hot)
    })
    afterEach(() => {
      resetHot()
      wrapper.vm.$destroy()
      wrapper = null
      hot = null
    })
    // it('should render toolbar menu titles', () => {
    //   toolbarMenuTitles.forEach(function(expectedMenuName) {
    //     expect(vm.$el.querySelector('#toolbar').textContent).to.contain(expectedMenuName)
    //   })
    // })
    //
    // it(`should have ${toolbarMenuTitles.length} menu titles`, () => {
    //   expect(vm.$el.querySelector('#toolbar li a div').length === toolbarMenuTitles.length)
    // })
    Home.data().toolbarMenus.forEach(menu => {
      it(`should open the correct panel when the toolbar menu title, ${menu.name} is clicked`, () => {
        let el = wrapper.findAll('#toolbar li').filter(w => {
          return w.contains(`#${menu.id}`)
        })
        // console.log(el.wrappers)
        if (el.length > 1) {
          throw new Error(`Should have found only 1 matching element, not ${el.length}`)
        }
        el.wrappers[0].trigger('click')
        // toolbarMenuTitles.forEach(function(expectedMenuName) {
        //   expect(vm.$el.querySelector('#toolbar').textContent).to.contain(expectedMenuName)
        // })
      })
    })
  })
  //
  // describe('Hot comments', () => {
  //   let wrapper
  //   let hot
  //   beforeEach(() => {
  //     const localVue = createLocalVue()
  //     localVue.use(Vuex)
  //     let store = new Vuex.Store(stubSimpleTabStore())
  //     wrapper = mount(Home, {store, localVue, attachToDocument: true})
  //     let container = wrapper.vm.$el.querySelector('#csvContent .editor')
  //     hot = registerHotWithContainer(container)
  //   })
  //   afterEach(() => {
  //     HotRegister.destroyAllHots()
  //     wrapper.vm.$destroy()
  //     wrapper = null
  //     hot = null
  //   })
  //   it('should trigger Comments when messages type equals error', sinonTest(async function() {
  //     expect(wrapper.vm.currentColumnIndex).to.equal(0)
  //     expect(wrapper.vm.messages).to.equal(false)
  //     this.stub(HotRegister, 'getActiveInstance').returns(hot)
  //     let errorsWrapper = shallowMountErrors()
  //     let messages = stubBasicErrorMessage1()
  //     wrapper.setData({messagesTitle: 'Validation Errors', messagesType: 'error', messages: messages})
  //     await flushPromises()
  //     const el = wrapper.findAll(`#csvContent .editor .ht_master table.htCore tr:nth-of-type(1) td:nth-of-type(1).htCommentCell`)
  //     expect(el.length).to.equal(1)
  //   }))
  //   it('should NOT trigger Comments when messages type does NOT equal error', sinonTest(async function() {
  //     expect(wrapper.vm.currentColumnIndex).to.equal(0)
  //     expect(wrapper.vm.messages).to.equal(false)
  //     this.stub(HotRegister, 'getActiveInstance').returns(hot)
  //     let messages = stubBasicErrorMessage1()
  //     wrapper.setData({messagesTitle: 'Validation Errors', messagesType: 'foo', messages: messages})
  //     await flushPromises()
  //     const el = wrapper.findAll(`#csvContent .editor .ht_master table.htCore tr:nth-of-type(1) td:nth-of-type(1).htCommentCell`)
  //     expect(el.length).to.equal(0)
  //   }))
  // })
})

// function stubBasicErrorMessage1() {
//   return [
//     {
//       rowNumber: 1,
//       columnNumber: 1,
//       message: 'Test error'
//     }
//   ]
// }
