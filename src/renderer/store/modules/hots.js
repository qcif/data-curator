const state = {
  hotTabs: {}
}

const getters = {
  getHotTitle: (state, getters) => (hotId) => {
    let title = _.get(state.hotTabs, `${hotId}.title`, `Untitled`)
    return title
  },
  getHotColumnProperties: (state, getters) => (hotId) => {
    let allColumnProperties = _.get(state.hotTabs, `${hotId}.columnProperties`)
    return allColumnProperties
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
    console.log('properties are...')
    console.log(property)
    let incoming = {}
    _.set(incoming, `${property.hotId}.columnProperties[${property.columnIndex}].${property.key}`, property.value)
    console.log('incoming is...')
    console.log(incoming)
    _.merge(state.hotTabs, incoming)
    console.log('leaving push hot properties...')
    console.dir(state.hotTabs)
  }
}

export default {
  state,
  getters,
  mutations
}
