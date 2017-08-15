const state = {
  hotTabs: {}
}

const getters = {
  getHotTitle: (state, getters) => (hotId) => {
    // let default = hotId.
    console.log('getting hot id title...')
    console.dir(state.hotTabs)
    // let defaultQualifier = _.get(state.hotTabs, `${hotId}.tabId`, '')
    let title = _.get(state.hotTabs, `${hotId}.title`, `Untitled.csv`)
    console.log(`title is ${title}`)
    return title
  }
}

const mutations = {
  pushHotTab (state, hotTab) {
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
  }
}

export default {
  state,
  getters,
  mutations
}
