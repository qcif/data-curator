
const state = {
  customProperties: {}
}

const getters = {
  getCustomProperty: (state, getters) => (property) => {
    return _.get(state.customProperties, property.key)
  },
  getCustomProperties: state => {
    return state.customProperties
  }
}

const mutations = {
  pushCustomProperty (state, property) {
    _.set(state.customProperties, property.key, property.value)
  },
  removeCustomProperty (state, propertyKey) {
    _.unset(state, 'customProperties', propertyKey)
  },
  resetCustomProperties (state) {
    state.customProperties = {}
  }
}

export default {
  state,
  getters,
  mutations
}
