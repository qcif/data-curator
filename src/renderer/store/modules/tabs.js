import { ipcRenderer as ipc } from 'electron'
import { setActiveGlobal, extractNameFromFile, resetGlobalFilenames } from '@/store/tabStoreUtilities'
import { activeTab$, allTabsTitles$ } from '@/rxSubject.js'

export function pushAllTabTitlesSubscription () {
  allTabsTitles$.next(getters.getAllTabTitles(state))
}

const state = {
  tabs: [],
  activeTab: '',
  tabObjects: {},
  tabIndex: -1,
  filenames: []
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
  getTabFilenames: state => {
    return state.filenames
  },
  getAllTabTitles: state => {
    let allTabTitles = {}
    _.forEach(state.tabObjects, function (object, tabId) {
      allTabTitles[tabId] = object.title
    })
    return allTabTitles
  },
  findTabIdFromTitle: (state, getters) => (title) => {
    return _.findKey(state.tabObjects, function (o) { return o.title === title })
  }
}

const mutations = {
  pushTab (state, tabId) {
    state.tabs.push(tabId)
  },
  pushTabTitle (state, tab) {
    let title
    if (tab.title) {
      title = tab.title
    } else {
      title = `Untitled${tab.index}`
    }
    _.set(state.tabObjects, `${tab.id}.title`, title)
    pushAllTabTitlesSubscription()
  },
  pushTabObject (state, tab) {
    if (tab.filename) {
      _.set(state.tabObjects, `${tab.id}.filename`, tab.filename)
      let title = extractNameFromFile(tab.filename)
      _.set(state.tabObjects, `${tab.id}.title`, title)
      // update global active references for electron-main
      setActiveGlobal(tab.filename, title)
      mutations.resetFilenames(state)
      ipc.send('toggleSaveMenu')
      pushAllTabTitlesSubscription()
    }
  },
  resetTabFilename (state, tabId) {
    _.unset(state.tabObjects[tabId], 'filename')
    mutations.resetFilenames(state)
    ipc.send('toggleSaveMenu')
    pushAllTabTitlesSubscription()
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
    mutations.resetFilenames(state)
    setActiveGlobal(state.tabObjects[state.activeTab].filename, state.tabObjects[tabId].title)
    ipc.send('toggleSaveMenu')
    activeTab$.next(tabId)
  },
  setTabsOrder (state, tabIdOrder) {
    state.tabs.length = 0
    state.tabs.push(...tabIdOrder)
  },
  incrementTabIndex (state) {
    state.tabIndex++
  },
  destroyTabObject (state, tabId) {
    _.unset(state.tabObjects, tabId)
    mutations.resetFilenames(state)
    pushAllTabTitlesSubscription()
  },
  resetFilenames (state) {
    let filtered = []
    _.forEach(state.tabObjects, (value, key) => {
      if (value.filename) { filtered.push(value.filename) }
    })
    state.filenames.length = 0
    state.filenames = filtered
    resetGlobalFilenames(filtered)
  }
}

export default {
  state,
  getters,
  mutations
}
