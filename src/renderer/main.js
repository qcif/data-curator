import Vue from 'vue'

import App from './App'
import router from './router'
import store from './store'

Vue.config.productionTip = false

let DefaultVue = Vue.extend({
  components: {App},
  router,
  store
})
function compileVue (mount, name) {
  // console.log(`name is ${name}`)
  new DefaultVue({template: `<App routerName="${name}"/>`}).$mount(mount)
}
if (document.querySelector('#app')) {
  compileVue('#app', 'default')
} else if (document.querySelector('#keyboardhelp')) {
  compileVue('#keyboardhelp', 'keyboardhelp')
} else if (document.querySelector('#openexcel')) {
  compileVue('#openexcel', 'openexcel')
} else {
  console.log('No match found for root id on incoming page.')
}
