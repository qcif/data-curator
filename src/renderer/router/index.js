import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)
export default new Router({
  routes: [
    {
      path: '/',
      name: 'home',
      components: {
        default: require('@/components/Home'),
        keyboardhelp: require('@/components/KeyboardHelp'),
        openexcel: require('@/components/SelectWorksheet'),
        errors: require('@/components/Errors')
      }
    },
    {
      path: '*',
      redirect: '/'
    }
  ]
})
