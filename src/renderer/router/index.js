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
        openexcel: require('@/components/SelectWorksheet')
      }
    },
    {
      path: '*',
      redirect: '/'
    }
    // Keep below commented out until implemented
    // {
    //   path: '/chooserepo',
    //   name: 'chooserepo',
    //   component: require('@/components/ChooseRepo')
    // },
    // {
    //   path: '/customformat',
    //   name: 'customformat',
    //   component: require('@/components/CustomFormat')
    // },
    // {
    //   path: '/github',
    //   name: 'github',
    //   component: require('@/components/Github')
    // },
    // {
    //   path: '/githubsuccess',
    //   name: 'githubsuccess',
    //   component: require('@/components/GithubSuccess')
    // }
  ]
})
