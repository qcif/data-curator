import Vue from 'vue'
// import axios from 'axios'

import App from './App'
import router from './router'
import store from './store'
import VeeValidate from 'vee-validate'
Vue.use(VeeValidate)

// if (!process.env.IS_WEB) {
//   Vue.use(require('vue-electron'))
// }
// Vue.http = Vue.prototype.$http = axios
Vue.config.productionTip = false

new Vue({
  components: {
    App
  },
  router,
  store,
  template: '<App/>'
}).$mount('#app')
