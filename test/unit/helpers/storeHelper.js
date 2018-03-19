import store from '@/store/modules/hots'

export function resetHotStore() {
  store.state = {
    hotTabs: {},
    packageProperties: {},
    provenanceProperties: { markdown: '' }
  }
}

export function stubSimpleTabStore() {
  const stubbedStore = {
    state: {
      tabs: [],
      activeTab: '',
      tabObjects: {},
      tabIndex: -1,
      activeTitle: '',
      hotTabs: {}
    },

    getters: {
      getTabs: state => {
        return ['tab0']
      },
      getActiveTab: state => {
        return 'tab0'
      },
      tabTitle: (state, getters) => (tabId) => {
        return `title`
      },
      getTabIndex: state => {
        return 0
      }
    },
    mutations: {
      pushTabTitle(state, tab) {
        _.set(state.tabObjects, `tab0.title`, 'title')
      },
      incrementTabIndex(state) {
        state.tabIndex++
      },
      setActiveTab (state, tabId) {
        state.activeTitle = 'title'
      },
      pushTab (state, tabId) {
        state.tabs.push('tab0')
      },
      pushPackageProperty(state, property) {
        _.set(state.packageProperties, property.key, property.value)
      },
      pushHotTab(state, hotTab) {
        _.set(state.hotTabs, `${hotTab.hotId}.tabId`, hotTab.tabId)
      },
      pushTableProperty(state, property) {
        _.set(state.hotTabs, `${property.hotId}.tableProperties.${property.key}`, property.value)
      }
    }
  }
  return stubbedStore
}
