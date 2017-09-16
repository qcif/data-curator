const state = {
  hotTabs: {},
  activeColumnIndex: {}
}

const getters = {
  getHotTitle: (state, getters) => (hotId) => {
    let title = _.get(state.hotTabs, `${hotId}.title`, `Untitled`)
    return title
  },
  getHotColumnProperties: (state, getters) => (hotId) => {
    let allColumnProperties = state.hotTabs[hotId].columnProperties
    return state.hotTabs[hotId].columnProperties
  },
  getActiveColumnIndex: (state, getters) => {
    console.log('getting active column triggered...')
    return state.activeColumnIndex
  }
}

const mutations = {
  pushHotTab(state, hotTab) {
    console.log('pushing hotTab object...')
    console.dir(hotTab)
    let hotId = hotTab.hotId
    if (!hotId) {
      console.log('No hotTab id found. Aborting hotTab object update...')
      return
    }
    if (hotTab.tabId) {
      _.set(state.hotTabs, `${hotId}.tabId`, hotTab.tabId)
    }
    if (hotTab.title) {
      _.set(state.hotTabs, `${hotId}.title`, hotTab.title)
    }
    console.log('leaving push hot tab...')
    console.dir(state.hotTabs)
  },
  pushHotColumns(state, hotTab) {
    console.log('state is...')
    console.log(state.hotTabs)
    let hotId = hotTab.hotId
    let current = {}
    _.set(current, `${hotId}.columnProperties`, state.hotTabs[hotId].columnProperties)
    console.log('current is...')
    console.log(current)
    _.set(state.hotTabs, `${hotId}.columnProperties`, hotTab.columnProperties)
    _.merge(state.hotTabs, current)
    console.log('leaving push hot tab column properties...')
    console.dir(state.hotTabs)
  },
  pushHotProperty(state, property) {
    let incoming = {}
    _.set(incoming, `${property.hotId}.columnProperties[${property.columnIndex}].${property.key}`, property.value)
    _.merge(state.hotTabs, incoming)
    let allColumnProperties = state.hotTabs[property.hotId].columnProperties[property.columnIndex][property.key]
    console.log('logging get column properties')
    console.log(allColumnProperties)
  },
  pushActiveColumn(state, activeColumnIndex) {
    state.activeColumn = activeColumnIndex
    console.log(`active column updated: ${state.activeColumn}`)
  },
  pushActiveColumnIndex(state, activeHotId, activeColumnIndex) {
    state.activeColumnIndex = {hot: activeHotId, index: activeColumnIndex}
  }
}

export default {
  state,
  getters,
  mutations
}
