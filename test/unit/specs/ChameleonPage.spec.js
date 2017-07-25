import Vue from 'vue'
import ChameleonPage from '@/components/ChameleonPage'

// dummmy test to begin with to incorporate vue/html with existing framework
describe('ChameleonPage.vue', () => {
  it('should render correct contents', () => {
    const vm = new Vue({
      el: document.createElement('div'),
      render: h => h(ChameleonPage)
    }).$mount()

    expect(vm.$el.querySelector('#left-panel').textContent).to.contain('')
  })
})
