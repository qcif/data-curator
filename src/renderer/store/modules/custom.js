
const state = {
  customProperties: {}
  // customColumnProperties: [],
  // customTableProperties: [],
  // customPackageProperties: []
}

const getters = {
  // getCustomColumnProperties: state => {
  //   return state.customColumnProperties
  // },
  // getCustomTableProperties: state => {
  //   return state.customTableProperties
  // },
  // getCustomPackageProperties: state => {
  //   return state.customPackageProperties
  // },
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
    const customTypes = _.get(property, 'types')
    // if (_.includes(customTypes, 'column') && _.indexOf(state.customColumnProperties, property.key) === -1) {
    //   state.customColumnProperties.push(property.key)
    // }
    // if (_.includes(customTypes, 'table') && _.indexOf(state.customColumnProperties, property.key) === -1) {
    //   state.customTableProperties.push(property.key)
    // }
    // if (_.includes(customTypes, 'package') && _.indexOf(state.customColumnProperties, property.key) === -1) {
    //   state.customPackageProperties.push(property.key)
    // }
  },
  removeCustomProperty (state, propertyKey) {
    _.unset(state, 'customProperties', propertyKey)
  },
  resetCustomProperties (state) {
    state.customProperties = {}
    // state.customColumnProperties = []
    // state.customTableProperties = []
    // state.customPackageProperties = []
  }
}

export default {
  state,
  getters,
  mutations
}
