import Vue from 'vue'
import Vuex from 'vuex'
import Home from '@/components/Home'

Vue.use(Vuex)
Vue.directive('tooltip', function(el, binding) {
  // el.style.backgroundColor = binding.value
})

// const actionsInjector = require('inject-loader!../../src/renderer/storage/modules/')

const mockedStore = {
  state: {
    tabs: [],
    activeTab: '',
    tabObjects: {},
    tabIndex: -1,
    activeTitle: ''
  },

  getters: {
    getTabs: state => {
      return 'mocked tab'
    },
    getActiveTab: state => {
      return 'mocked active tab'
    },
    tabTitle: (state, getters) => (tabId) => {
      return `mocked title for ${tabId}`
    }
  }
}

// dummmy test to begin with to incorporate vue/html with existing framework
describe('Home.vue toolbar menus', () => {
  const vm = new Vue({
    el: document.createElement('div'),
    render: h => h(Home),
    store: new Vuex.Store(mockedStore)
  }).$mount()

  let toolbarMenuTitles = ['Validate', 'Column', 'Table', 'Provenance', 'Package', 'Export']

  it('should render toolbar menu titles', () => {
    toolbarMenuTitles.forEach(function(expectedMenuName) {
      expect(vm.$el.querySelector('#toolbar').textContent).to.contain(expectedMenuName)
    })
  })

  it(`should have ${toolbarMenuTitles.length} menu titles`, () => {
    expect(vm.$el.querySelector('#toolbar li a div').length === toolbarMenuTitles.length)
  })
})
