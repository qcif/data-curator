const state = {
  activeHotId: ''
}

const getters = {
  getActiveHotId: state => {
    return state.activeHotId
  }
}

const mutations = {
  pushActiveHotId (state, hotId) {
    state.activeHotId = hotId
  }
}

export default {
  state,
  getters,
  mutations
}
