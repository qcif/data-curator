import Vue from 'vue'

import App from './App'
import router from './router'
import store from './store'
import VeeValidate from 'vee-validate'
Vue.use(VeeValidate)

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
  console.log('got first choice')
  compileVue('#app', 'default')
} else if (document.querySelector('#keyboardhelp')) {
  console.log('got second choice')
  compileVue('#keyboardhelp', 'keyboardhelp')
} else if (document.querySelector('#openexcel')) {
  console.log('got third choice')
  compileVue('#openexcel', 'openexcel')
} else {
  console.log('No match found for root id on incoming page.')
}
