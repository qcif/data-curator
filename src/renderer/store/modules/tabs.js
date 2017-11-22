import {ipcRenderer as ipc} from 'electron'
import {setActiveGlobal, extractNameFromFile, resetGlobalFilenames} from '@/store/tabStoreUtilities'
// import {activeRxTab} from '@/rxSubject.js'

const state = {
  tabs: [],
  activeTab: '',
  tabObjects: {},
  tabIndex: -1,
  activeTitle: ''
}

const getters = {
  getTabs: state => {
    return state.tabs
  },
  getTabObjects: state => {
    return state.tabObjects
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
    return _.get(state.tabObjects, `${tabId}.title`)
  },
  // TODO: revise hot filenames are kept as it is here, but reset in global
  getTabFilenames: state => {
    let filtered = []
    _.forEach(state.tabObjects, (value, key) => {
      if (value.filename) { filtered.push(value.filename) }
    })
    return filtered
  }
}

const mutations = {
  pushTab (state, tabId) {
    state.tabs.push(tabId)
  },
  pushTabTitle(state, tab) {
    let title
    if (tab.title) {
      title = tab.title
    } else {
      title = `Untitled${tab.index}`
    }
    _.set(state.tabObjects, `${tab.id}.title`, title)
  },
  pushTabObject(state, tab) {
    if (tab.filename) {
      _.set(state.tabObjects, `${tab.id}.filename`, tab.filename)
      let title = extractNameFromFile(tab.filename)
      _.set(state.tabObjects, `${tab.id}.title`, title)
      // update global active references for electron-main
      setActiveGlobal(tab.filename, title)
      resetGlobalFilenames(getters.getTabFilenames(state))
      ipc.send('toggleSaveMenu')
    }
  },
  removeTab (state, tabId) {
    // keep check for index in this function to ensure tabid still exists
    let index = _.indexOf(state.tabs, tabId)
    if (index !== -1) {
      state.tabs.splice(index, 1)
    }
  },
  setActiveTab (state, tabId) {
    state.activeTab = `${tabId}`
    console.log('state is...')
    console.log(state)
    // activeRxTab.next(tabId)
    // TODO : now that we use activeTitle as global and we can access with activeTab and tabObjects, keeping it in store is redundant - remove.
    state.activeTitle = state.tabObjects[tabId].title
    setActiveGlobal(state.tabObjects[state.activeTab].filename, state.activeTitle)
    console.log('setting global filenames...')
    resetGlobalFilenames(getters.getTabFilenames(state))
    ipc.send('toggleSaveMenu')
  },
  setTabsOrder (state, tabIdOrder) {
    state.tabs = tabIdOrder
  },
  incrementTabIndex(state) {
    state.tabIndex++
  },
  destroyTabObject(state, tabId) {
    _.unset(state.tabObjects, tabId)
    resetGlobalFilenames(getters.getTabFilenames(state))
  }
}

export default {
  state,
  getters,
  mutations
}
