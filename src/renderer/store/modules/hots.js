const state = {
  hotTabs: {},
  packageProperties: {},
  provenanceProperties: {}
}

const tableFields = ['encoding', 'format', 'mediatype', 'missingValues', 'name', 'path', 'profile', 'sources', 'title', 'primaryKeys', 'description', 'licenses']
const packageFields = ['description', 'id', 'licenses', 'name', 'profile', 'sources', 'title', 'version']
const columnFields = ['constraints', 'format', 'name', 'type', 'title', 'description', 'rdfType']

function getHotColumnPropertiesFromPropertyObject(property) {
  let allHotColumnProperties = state.hotTabs[property.hotId].columnProperties
  if (!allHotColumnProperties) {
    mutations.resetAllColumnPropertiesForHotId(state, property.hotId)
    allHotColumnProperties = state.hotTabs[property.hotId].columnProperties
  }
  let hotColumnProperties = allHotColumnProperties[property.columnIndex]
  if (!hotColumnProperties) {
    mutations.resetColumnPropertiesForHotId(state, property)
    hotColumnProperties = allHotColumnProperties[property.columnIndex]
  }
  return hotColumnProperties
}

const getters = {
  getHotTabs: state => {
    return state.hotTabs
  },
  getAllHotColumnPropertiesFromHotId: (state, getters) => (hotId) => {
    return state.hotTabs[hotId].columnProperties || []
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
  getProvenance: state => {
    return state.provenanceProperties
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
  pushProvenance(state, value) {
    _.set(state.provenanceProperties, 'markdown', value)
  },
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
    // mutations.mergeCurrentColumnPropertiesOverTableSchema(state, property.hotId)
    console.log(state.hotTabs)
  },
  pushTableProperty(state, property) {
    _.set(state.hotTabs, `${property.hotId}.tableProperties.${property.key}`, property.value)
    console.log(state.hotTabs)
  },
  // TODO : tidy up these schema methods so that:
  // - once we have a schema guess, always point the properties to the schema fields and then update these
  pushTableSchemaProperty(state, property) {
    mutations.pushTableProperty(state, property)
    // let hotTab = state.hotTabs[property.hotId]
    // if (hotTab.tableSchema) {
    //   hotTab.tableSchema.schema[property.key] = property.value
    // }
  },
  pushTableSchemaDescriptorProperty(state, property) {
    mutations.pushTableProperty(state, property)
    // let hotTab = state.hotTabs[property.hotId]
    // if (hotTab.tableSchema) {
    //   hotTab.tableSchema.schema.descriptor[property.key] = property.value
    // }
  },
  pushPackageProperty(state, property) {
    _.set(state.packageProperties, property.key, property.value)
    console.log(state.packageProperties)
  },
  pushMissingValues(state, hotMissingValues) {
    let hotId = hotMissingValues.hotId
    _.set(state.hotTabs, `${hotId}.tableProperties.missingValues`, hotMissingValues.missingValues)
    // if (state.hotTabs[hotId].tableSchema) {
    //   mutations.overwriteTableSchemaDescriptorProperty(state, hotId, 'missingValues')
    // }
  },
  // TODO : atm just chucking in entire table - probabaly only need schema and headers
  pushTableSchema(state, hotTable) {
    console.log('pushing table schema')
    // let hotId = hotTable.hotId
    // let tableSchema = _.set(state.hotTabs, `${hotId}.tableSchema`, hotTable.tableSchema)
    let isColumnPropertiesMerged = mutations.mergeTableSchemaOverCurrentColumnProperties(state, hotTable)
    console.log(state.hotTabs)
    // return tableSchema && isColumnPropertiesMerged
    return isColumnPropertiesMerged
  },

  // TODO : once this behaviour is ensured (ie: we always overwrite) tidy up these 'merge' methods so that:
  // - once we have a schema guess, always point the columnProperties to the schema fields and then update these
  mergeTableSchemaOverCurrentColumnProperties(state, hotIdSchema) {
    let hotId = hotIdSchema.hotId
    let hotTab = state.hotTabs[hotId]
    //    let tableSchemaProperties = hotTab.tableSchema.schema.descriptor.fields
    // let schemaFields = hotIdSchema.schema.descriptor.fields
    if (!hotTab.columnProperties) {
      hotTab.columnProperties = []
    }
    console.log('examining table schema descriptor...')
    console.log(hotIdSchema.schema.descriptor)
    // we cannot mutate the vuex state itself (in lodash call) - we can only assign a new value
    let columnProperties = [...hotTab.columnProperties]
    let isMerged = _.merge(columnProperties, hotIdSchema.schema.descriptor.fields)
    state.hotTabs[hotId].columnProperties = columnProperties
    return isMerged
  },
  // mergeTableSchemaOverCurrentColumnProperties(state, hotId) {
  //   let hotTab = state.hotTabs[hotId]
  //   let tableSchemaProperties = hotTab.tableSchema.schema.descriptor.fields
  //   if (!hotTab.columnProperties) {
  //     hotTab.columnProperties = []
  //   }
  //   // we cannot mutate the vuex state itself (in lodash call) - we can only assign a new value
  //   let columnProperties = [...hotTab.columnProperties]
  //   let isMerged = _.merge(columnProperties, tableSchemaProperties)
  //   state.hotTabs[hotId].columnProperties = columnProperties
  //   return isMerged
  // },
  // TODO : once this behaviour is ensured (ie: we always overwrite) tidy up these 'merge' methods so that:
  // - once we have a schema guess, always point the columnProperties to the schema fields and then update these
  // mergeCurrentColumnPropertiesOverTableSchema(state, hotId) {
  //   let hotTab = state.hotTabs[hotId]
  //   let tableSchema = hotTab.tableSchema
  //   if (tableSchema) {
  //     let tableSchemaProperties = [...hotTab.tableSchema.schema.descriptor.fields]
  //     let columnProperties = hotTab.columnProperties || []
  //     let isMerged = _.merge(tableSchemaProperties, columnProperties)
  //     state.hotTabs[hotId].tableSchema.schema.descriptor.fields = tableSchemaProperties
  //   }
  // },
  destroyHotTab(state, hotId) {
    _.unset(state.hotTabs, hotId)
  },
  async destroyHotTabFromTabId(state, tabId) {
    let hotId = await getters.getHotIdFromTabId(tabId)
    _.unset(state.hotTabs, hotId)
  },
  resetAllColumnPropertiesForHotId(state, hotId) {
    state.hotTabs[hotId].columnProperties = []
  },
  resetColumnPropertiesForHotId(state, property) {
    state.hotTabs[property.hotId].columnProperties[property.columnIndex] = {}
  },
  resetPackagePropertiesToObject(state, properties) {
    _.set(state, 'packageProperties', properties)
  },
  resetTablePropertiesToObject(state, hotIdTables) {
    for (let hotId in hotIdTables) {
      if (!state.hotTabs[hotId]) {
        throw new Error(`Unable to find tab with hot id: ${hotId}`)
      }
      _.set(state.hotTabs[hotId], 'tableProperties', hotIdTables[hotId])
    }
  },
  resetColumnPropertiesToObject(state, hotIdColumns) {
    for (let hotId in hotIdColumns) {
      if (!state.hotTabs[hotId]) {
        throw new Error(`Unable to find tab with hot id: ${hotId}`)
      }
      _.set(state.hotTabs[hotId], 'columnProperties', hotIdColumns[hotId])
    }
  }
}

export default {
  state,
  getters,
  mutations
}
