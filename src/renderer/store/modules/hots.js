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
    return new Promise((resolve, reject) => {
      let hotId = _.findKey(state.hotTabs, {tabId: tabId})
      if (!hotId) {
        // There is a short render wait in home page, so if hotId not first returned, just wait and try again
        _.delay(function(tabId) {
          // console.log('finally returning...')
          resolve(_.findKey(state.hotTabs, {tabId: tabId}))
        }, 10, tabId)
      } else {
        resolve(hotId)
      }
    })
  },
  getMissingValuesFromHot: (state, getters) => (hotId) => {
    return state.hotTabs[hotId].missingValues
  }
}

const mutations = {
  pushHotTab(state, hotTab) {
    let hotId = hotTab.hotId
    if (!hotId) {
      return
    }
    if (hotTab.tabId) {
      _.set(state.hotTabs, `${hotId}.tabId`, hotTab.tabId)
    }
  },
  pushHotColumns(state, hotTab) {
    mutations.pushHotColumnsAndOverwrite(state, hotTab)
  },
  pushHotColumnsAndOverwrite(state, hotTab) {
    let hotId = hotTab.hotId
    let incoming = {}
    _.set(incoming, `${hotId}.columnProperties`, hotTab.columnProperties)
    // update existing values and write in new ones where none currently exist
    _.merge(state.hotTabs, incoming)
  },
  pushHotColumnsAndUnderwrite(state, hotTab) {
    let hotId = hotTab.hotId
    let current = {}
    _.set(current, `${hotId}.columnProperties`, state.hotTabs[hotId].columnProperties)
    // intended for pushing schema descriptor: only write new values for those which don't already exist
    _.set(state.hotTabs, `${hotId}.columnProperties`, hotTab.columnProperties)
    _.merge(state.hotTabs, current)
  },
  // pushing a new schema should also merge over current column properties
  mergeTableSchemaOverCurrentColumnProperties(state, hotId) {
    let hotTab = state.hotTabs[hotId]
    let tableSchemaProperties = hotTab.tableSchema.schema.descriptor.fields
    let columnProperties = hotTab.columnProperties || []
    _.merge(columnProperties, tableSchemaProperties)
  },
  // a new schema infer shouldn't overwrite any user created input
  mergeCurrentColumnPropertiesOverTableSchema(state, hotId) {
    let hotTab = state.hotTabs[hotId]
    let tableSchemaProperties = hotTab.tableSchema.schema.descriptor.fields
    let columnProperties = hotTab.columnProperties || []
    _.merge(tableSchemaProperties, columnProperties)
  },
  pushTableSchema(state, hotTable) {
    let hotId = hotTable.hotId
    _.set(state.hotTabs, `${hotId}.tableSchema`, hotTable.tableSchema)
    mutations.mergeTableSchemaOverCurrentColumnProperties(state, hotId)
  },
  pushHotProperty(state, property) {
    let incoming = {}
    _.set(incoming, `${property.hotId}.columnProperties[${property.columnIndex}].${property.key}`, property.value)
    _.merge(state.hotTabs, incoming)
    let allColumnProperties = state.hotTabs[property.hotId].columnProperties[property.columnIndex][property.key]
  },
  pushMissingValues(state, hotMissingValues) {
    let hotId = hotMissingValues.hotId
    _.set(state.hotTabs, `${hotId}.missingValues`, hotMissingValues.missingValues)
    // console.log('pushed missing values')
    // console.log(state.hotTabs)
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
