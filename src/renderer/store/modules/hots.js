const state = {
  hotTabs: {}
}

const getters = {
  getHotTitle: (state, getters) => (hotId) => {
    let title = _.get(state.hotTabs, `${hotId}.title`, `Untitled.csv`)
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
    let hotId = hotTab.hotId
    console.log('properties are...')
    console.log(hotTab.columnProperties)
    // for (let objects of hotTab.columnProperties) {
    //   Object.keys(objects).map(function(key) {
    //     _.set(state.hotTabs, `${hotId}.columnProperties.label`, key)
    //     _.set(state.hotTabs, `${hotId}.columnProperties.value`, value)
    //   })
    // }
    _.set(state.hotTabs, `${hotId}.columnProperties`, hotTab.columnProperties)
    console.log('leaving push hot tab column properties...')
    console.dir(state.hotTabs)
  }
}

export default {
  state,
  getters,
  mutations
}
