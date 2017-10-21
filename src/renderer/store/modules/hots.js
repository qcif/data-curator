const state = {
  hotTabs: {},
  packageProperties: {}
}

function getHotColumnPropertiesFromPropertyObject(property) {
  let allHotColumnProperties = state.hotTabs[property.hotId].columnProperties
  if (!allHotColumnProperties) {
    allHotColumnProperties = state.hotTabs[property.hotId].columnProperties = []
  }
  let hotColumnProperties = allHotColumnProperties[property.columnIndex]
  if (!hotColumnProperties) {
    hotColumnProperties = state.hotTabs[property.hotId].columnProperties[property.columnIndex] = {}
  }
  return hotColumnProperties
}

const getters = {
  getAllHotColumnPropertiesFromHotId: (state, getters) => (hotId) => {
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
          resolve(_.findKey(state.hotTabs, {tabId: tabId}))
        }, 10, tabId)
      } else {
        resolve(hotId)
      }
    })
  },
  getMissingValuesFromHot: (state, getters) => (hotId) => {
    if (state.hotTabs[hotId].tableProperties) {
      return state.hotTabs[hotId].tableProperties.missingValues
    }
  },
  getHotColumnProperty: (state, getters) => (property) => {
    let hotColumnProperties = getHotColumnPropertiesFromPropertyObject(property)
    return hotColumnProperties[property.key]
  },
  getTableProperty: (state, getters) => (property) => {
    let tableProperties = state.hotTabs[property.hotId].tableProperties || {}
    return tableProperties[property.key]
  },
  getPackageProperty: (state, getters) => (property) => {
    console.log(`property key is `)
    console.log(property)
    console.log(state.packageProperties)
    return state.packageProperties[property.key]
  },
  getHotColumnConstraints: (state, getters) => (property) => {
    let hotColumnProperties = getHotColumnPropertiesFromPropertyObject(property)
    return hotColumnProperties['constraints']
  },
  getConstraint: (state, getters) => (property) => {
    let hotColumnProperties = getHotColumnPropertiesFromPropertyObject(property)
    let constraints = hotColumnProperties['constraints']
    if (!constraints) {
      constraints = state.hotTabs[property.hotId].columnProperties[property.columnIndex].constraints = {}
    }
    return constraints[property.key]
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
  pushColumnProperty(state, property) {
    _.set(state.hotTabs, `${property.hotId}.columnProperties[${property.columnIndex}].${property.key}`, property.value)
    mutations.mergeCurrentColumnPropertiesOverTableSchema(state, property.hotId)
  },
  pushTableProperty(state, property) {
    _.set(state.hotTabs, `${property.hotId}.tableProperties.${property.key}`, property.value)
  },
  pushTableSchemaProperty(state, property) {
    mutations.pushTableProperty(state, property)
    let hotTab = state.hotTabs[property.hotId]
    if (hotTab.tableSchema) {
      hotTab.tableSchema.schema[property.key] = property.value
    }
  },
  pushTableSchemaDescriptorProperty(state, property) {
    mutations.pushTableProperty(state, property)
    let hotTab = state.hotTabs[property.hotId]
    if (hotTab.tableSchema) {
      hotTab.tableSchema.schema.descriptor[property.key] = property.value
    }
  },
  pushPackageProperty(state, property) {
    _.set(state.packageProperties, property.key, property.value)
    console.log(state.packageProperties)
  },
  pushMissingValues(state, hotMissingValues) {
    let hotId = hotMissingValues.hotId
    _.set(state.hotTabs, `${hotId}.tableProperties.missingValues`, hotMissingValues.missingValues)
    if (state.hotTabs[hotId].tableSchema) {
      mutations.overwriteTableSchemaDescriptorProperty(state, hotId, 'missingValues')
    }
  },
  pushTableSchema(state, hotTable) {
    console.log('pushing table schema')
    let hotId = hotTable.hotId
    _.set(state.hotTabs, `${hotId}.tableSchema`, hotTable.tableSchema)
    mutations.mergeTableSchemaOverCurrentColumnProperties(state, hotId)
    console.log(state.hotTabs)
  },
  mergeTableSchemaOverCurrentColumnProperties(state, hotId) {
    let hotTab = state.hotTabs[hotId]
    let tableSchemaProperties = hotTab.tableSchema.schema.descriptor.fields
    if (!hotTab.columnProperties) {
      hotTab.columnProperties = []
    }
    _.merge(hotTab.columnProperties, tableSchemaProperties)
  },
  mergeCurrentColumnPropertiesOverTableSchema(state, hotId) {
    let hotTab = state.hotTabs[hotId]
    let tableSchema = hotTab.tableSchema
    if (tableSchema) {
      let tableSchemaProperties = hotTab.tableSchema.schema.descriptor.fields
      let columnProperties = hotTab.columnProperties || []
      _.merge(tableSchemaProperties, columnProperties)
    }
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
