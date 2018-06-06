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
  new DefaultVue({template: `<App routerName="${name}"/>`}).$mount(mount)
}
if (document.querySelector('#app')) {
  compileVue('#app', 'default')
} else if (document.querySelector('#keyboardhelp')) {
  compileVue('#keyboardhelp', 'keyboardhelp')
} else if (document.querySelector('#openexcel')) {
  compileVue('#openexcel', 'openexcel')
} else if (document.querySelector('#errors')) {
  compileVue('#errors', 'errors')
} else if (document.querySelector('#urldialog')) {
  compileVue('#urldialog', 'urldialog')
} else {
  console.error('No match found for root id on incoming page.')
}
