import Home from '@/components/Home'
import {stubSimpleTabStore} from '../helpers/storeHelper.js'
import {mountVuePageWithStore} from '../helpers/vueHelper.js'

describe('Home.vue', () => {
  const vm = mountVuePageWithStore(Home, stubSimpleTabStore)

  // dummmy test to begin with to incorporate vue/html with existing framework
  describe('Home.vue toolbar menus', () => {
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
})
