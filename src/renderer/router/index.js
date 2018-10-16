import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)
export default new Router({
  routes: [
    {
      path: '/',
      name: 'home',
      components: {
        default: require('@/components/Home').default,
        keyboardhelp: require('@/components/KeyboardHelp').default,
        urldialog: require('@/components/UrlDialog').default,
        openexcel: require('@/components/SelectWorksheet').default,
        errors: require('@/components/Errors').default
      }
    },
    {
      path: '*',
      redirect: '/'
    }
  ]
})
