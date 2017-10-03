const state = {
  hotTabs: {}
}

const getters = {
  getHotColumnProperties: (state, getters) => (hotId) => {
    return state.hotTabs[hotId].columnProperties
  },
  getHotTableSchema: (state, getters) => (hotId) => {
    return state.hotTabs[hotId].tableSchema
  },
  getHotIdFromTabId: (state, getters) => (tabId) => {
    let hotId = _.findKey(state.hotTabs, {tabId: tabId})
    return hotId
  }
}

const mutations = {
  pushHotTab(state, hotTab) {
    console.dir(hotTab)
    let hotId = hotTab.hotId
    if (!hotId) {
      return
    }
    if (hotTab.tabId) {
      _.set(state.hotTabs, `${hotId}.tabId`, hotTab.tabId)
    }
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
    // intended for pushing schema descriptor: only write new values for those which don't already exist
    _.set(state.hotTabs, `${hotId}.columnProperties`, hotTab.columnProperties)
    _.merge(state.hotTabs, current)
    console.log('leaving push hot tab column properties...')
    console.dir(state.hotTabs)
  },
  // a new schema infer shouldn't overwrite any user created input
  mergeCurrentColumnPropertiesOverTableSchema(state, hotId) {
    let hotTab = state.hotTabs[hotId]
    let tableSchemaProperties = hotTab.tableSchema.schema.descriptor.fields
    let columnProperties = hotTab.columnProperties || []
    console.log('table schema properties')
    console.log(tableSchemaProperties)
    console.log('column properties are')
    console.log(columnProperties)
    _.merge(tableSchemaProperties, columnProperties)
    console.log(`finished constraints from column over schema`)
    console.log(tableSchemaProperties)
  },
  pushTableSchema(state, hotTable) {
    console.log('state is...')
    console.log(state.hotTabs)
    let hotId = hotTable.hotId
    _.set(state.hotTabs, `${hotId}.tableSchema`, hotTable.tableSchema)
    mutations.mergeCurrentColumnPropertiesOverTableSchema(state, hotId)
    console.dir(state.hotTabs)
  },
  pushHotProperty(state, property) {
    console.log(`incoming property: ${property}`)
    console.log(property)
    let incoming = {}
    _.set(incoming, `${property.hotId}.columnProperties[${property.columnIndex}].${property.key}`, property.value)
    _.merge(state.hotTabs, incoming)
    let allColumnProperties = state.hotTabs[property.hotId].columnProperties[property.columnIndex][property.key]
    console.log('logging get column properties')
    console.log(allColumnProperties)
  },
  destroyHotTab(state, hotId) {
    _.unset(state.hotTabs, hotId)
  },
  destroyHotTabFromTabId(state, tabId) {
    let hotId = getters.getHotIdFromTabId()
    _.unset(state.hotTabs, hotId)
  }
}

export default {
  state,
  getters,
  mutations
}
