import path from 'path'
import {remote, ipcRenderer as ipc} from 'electron'

function setGlobal(filename, title) {
  remote.getGlobal('tab').activeFilename = filename
  remote.getGlobal('tab').activeTitle = title
  remote.getGlobal('tab').filenames = getAllFilenames()
}

function extractNameFromFile(fullPath) {
  let basename = path.basename(fullPath)
  let extension = path.extname(basename)
  return basename.substring(0, basename.lastIndexOf(extension))
}

function getAllFilenames() {
  let tabObjects = state.tabObjects
  let filtered = []
  _.forEach(tabObjects, (value, key) => {
    if (value.filename) { filtered.push(value.filename) }
  })
  console.log(filtered)
  return filtered
}

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
      setGlobal(tab.filename, title)
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
    // TODO : now that we use activeTitle as global and we can access with activeTab and tabObjects, keeping it in store is redundant - remove.
    state.activeTitle = state.tabObjects[tabId].title
    setGlobal(state.tabObjects[state.activeTab].filename, state.activeTitle)
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
  }
}

export default {
  getAllFilenames,
  state,
  getters,
  mutations
}
