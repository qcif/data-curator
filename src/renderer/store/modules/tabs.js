const state = {
  tabs: [],
  activeTab: '',
  tabIndex: -1
}

const getters = {
  getTabs: state => {
    return state.tabs
  },
  getActiveTab: state => {
    return state.activeTab
  },
  getTabIndex: state => {
    return state.tabIndex
  },
  getPreviousTabId: (state, getters) => (position) => {
    let previousActiveTabPos = position < 1 ? 0 : position - 1
    return state.tabs[previousActiveTabPos]
  }
}

const mutations = {
  pushTab (state, tabId) {
    console.log('...pushing...')
    state.tabs.push(tabId)
    console.log(state.tabs)
  },
  removeTab (state, tabId) {
    let targetTabPosition = $.inArray(tabId, state.tabs)
    state.tabs.splice(targetTabPosition, 1)
  },
  setActiveTab (state, tabId) {
    console.log(tabId)
    console.log(`tab id: ${tabId}`)
    console.log(`previous active was: ${state.activeTab}`)
    state.activeTab = `${tabId}`
  },
  setTabs (state, tabIdOrder) {
    console.log(`tab order ${tabIdOrder}`)
    state.tabs = tabIdOrder
  },
  incrementTabIndex(state) {
    state.tabIndex++
  }
}

export default {
  state,
  getters,
  mutations
}
