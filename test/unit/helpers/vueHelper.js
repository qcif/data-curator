import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)
Vue.directive('tooltip', function(el, binding) {
  // el.style.backgroundColor = binding.value
})

export function mountVuePageWithStore(page, storeFn) {
  const vm = new Vue({
    el: document.createElement('div'),
    render: p => p(page),
    store: new Vuex.Store(storeFn())
  }).$mount()
  return vm
}
