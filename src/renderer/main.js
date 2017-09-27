import Vue from 'vue'
import axios from 'axios'

import App from './App'
import router from './router'
import store from './store'
import Tooltip from 'vue-directive-tooltip/dist/vueDirectiveTooltip.js'
import 'vue-directive-tooltip/css/index.css'
Vue.use(Tooltip)

if (!process.env.IS_WEB) {
  Vue.use(require('vue-electron'))
}
Vue.http = Vue.prototype.$http = axios
Vue.config.productionTip = false

new Vue({
  components: {
    App
  },
  router,
  store,
  template: '<App/>'
}).$mount('#app')
