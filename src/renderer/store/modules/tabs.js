const state = {
  tabs: [],
  activeTab: '',
  tabTitles: {},
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
  },
  tabTitle: (state, getters) => (tabId) => {
    console.log('getting title from tabs store')
    console.log(`tab id is: ${tabId}`)
    return _.get(state.tabTitles, `${tabId}.title`)
  }
}

const mutations = {
  pushTab (state, tabId) {
    console.log('...pushing...')
    state.tabs.push(tabId)
    console.log(state.tabs)
  },
  pushTabTitle(state, tab) {
    let title
    if (tab.title) {
      title = tab.title
    } else {
      title = `Untitled${tab.index}`
    }
    _.set(state.tabTitles, `${tab.id}.title`, title)
  },
  removeTab (state, tabId) {
    // keep check for index in this function to ensure tabid still exists
    let index = _.indexOf(state.tabs, tabId)
    if (index !== -1) {
      state.tabs.splice(index, 1)
    }
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
