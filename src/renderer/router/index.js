import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

// TODO : refactor with queries/ multiple components as won't accomodate in current form for built packages
export default new Router({
  routes: [
    {
      path: '/',
      name: 'home',
      component: require('@/components/Home')
    },
    {
      path: '/datapackage',
      name: 'datapackage',
      component: require('@/components/DataPackage')
    },
    {
      path: '/keyboardhelp',
      name: 'keyboardhelp',
      component: require('@/components/KeyboardHelp')
    },
    {
      path: '/chooserepo',
      name: 'chooserepo',
      component: require('@/components/ChooseRepo')
    },
    {
      path: '/customformat',
      name: 'customformat',
      component: require('@/components/CustomFormat')
    },
    {
      path: '/github',
      name: 'github',
      component: require('@/components/Github')
    },
    {
      path: '/githubsuccess',
      name: 'githubsuccess',
      component: require('@/components/GithubSuccess')
    },
    {
      path: '/selectworksheet',
      name: 'selectworksheet',
      component: require('@/components/SelectWorksheet')
    },
    {
      path: '*',
      redirect: '/'
    }
  ]
})
