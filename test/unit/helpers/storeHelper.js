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
      activeTitle: ''
    },

    getters: {
      getTabs: state => {
        return 'stubbed tab'
      },
      getActiveTab: state => {
        return 'stubbed active tab'
      },
      tabTitle: (state, getters) => (tabId) => {
        return `stubbed title for ${tabId}`
      }
    }
  }
  return stubbedStore
}
