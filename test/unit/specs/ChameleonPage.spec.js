import Vue from 'vue'
import HomePage from '@/components/HomePage'

// dummmy test to begin with to incorporate vue/html with existing framework
describe('HomePage.vue', () => {
  it('should render correct contents', () => {
    const vm = new Vue({
      el: document.createElement('div'),
      render: h => h(HomePage)
    }).$mount()

    expect(vm.$el.querySelector('#left-panel').textContent).to.contain('')
  })
})
