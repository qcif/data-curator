import Vue from 'vue'
import home from '@/components/Home'

// dummmy test to begin with to incorporate vue/html with existing framework
describe('Home.vue', () => {
  it('should render correct contents', () => {
    const vm = new Vue({
      el: document.createElement('div'),
      render: h => h(home)
    }).$mount()

    expect(vm.$el.querySelector('.navbar-brand').textContent).to.contain('Data Curator')
  })
})
