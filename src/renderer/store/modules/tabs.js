import {remote} from 'electron'
import path from 'path'
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
    return _.get(state.tabObjects, `${tabId}.title`)
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
    _.set(state.tabObjects, `${tab.id}.title`, title)
  },
  pushTabObject(state, tab) {
    console.log('logging tab on push tab object')
    console.log(tab)
    if (tab.filename) {
      _.set(state.tabObjects, `${tab.id}.filename`, tab.filename)
      // tab title should reflect basename minus extension of filename
      let fullPath = tab.filename
      let basename = path.basename(fullPath)
      let extension = path.extname(basename)
      let doctored = basename.substring(0, basename.lastIndexOf(extension))
      _.set(state.tabObjects, `${tab.id}.title`, doctored)
      // update global active references for electron-main
      remote.getGlobal('tab').activeFilename = tab.filename
      remote.getGlobal('tab').activeTitle = doctored
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
    state.activeTitle = state.tabObjects[tabId].title
    console.log(`active tab is: ${state.activeTab}`)
    remote.getGlobal('tab').activeTitle = state.activeTitle
    remote.getGlobal('tab').activeFilename = state.tabObjects[state.activeTab].filename
    console.log('logging tab objects...')
    console.log(state.tabObjects)
    console.log('logging globals')
    console.log(remote.getGlobal('tab'))
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
