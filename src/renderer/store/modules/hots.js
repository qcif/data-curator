const state = {
  hotTabs: {},
  packageProperties: {},
  provenanceProperties: { markdown: '', errors: '' }
}

const tableFields = ['encoding', 'format', 'mediatype', 'missingValues', 'name', 'path', 'profile', 'sources', 'title', 'primaryKeys', 'description', 'licenses']
const packageFields = ['description', 'id', 'licenses', 'name', 'profile', 'sources', 'title', 'version']
const columnFields = ['constraints', 'format', 'name', 'type', 'title', 'description', 'rdfType']

export function getHotColumnPropertiesFromPropertyObject(property) {
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

export function getHotIdFromTabIdFunction() {
  return getters.getHotIdFromTabId(state, getters)
}

const getters = {
  getHotTabs: state => {
    return state.hotTabs
  },
  getHotSelection: (state, getters) => (hotId) => {
    return state.hotTabs[hotId].selected
  },
  getTableProperties: (state, getters) => (hotId) => {
    return state.hotTabs[hotId].tableProperties || {}
  },
  getAllHotColumnPropertiesFromHotId: (state, getters) => (hotId) => {
    return state.hotTabs[hotId].columnProperties || []
  },
  // ensure getter fires each time by passing in function
  getAllHotTablesColumnNames: (state, getters) => () => {
    let hotIdColumnNames = {}
    for (let hotId in state.hotTabs) {
      let columnProps = state.hotTabs[hotId].columnProperties || []
      let columnNames = columnProps.map(column => {
        return column.name
      })
      hotIdColumnNames[hotId] = columnNames
    }
    return hotIdColumnNames
  },
  getAllHotTablesColumnProperties: (state, getters) => () => {
    let hotIdColumnNames = {}
    for (let hotId in state.hotTabs) {
      hotIdColumnNames[hotId] = state.hotTabs[hotId].columnProperties || []
    }
    return hotIdColumnNames
  },
  getAllHotColumnNamesFromHotId: (state, getters) => (hotId) => {
    return getters.getAllHotColumnPropertyFromHotId(state, getters)({hotId: hotId, key: 'name'})
  },
  getAllHotColumnTypesFromHotId: (state, getters) => (hotId) => {
    return getters.getAllHotColumnPropertyFromHotId(state, getters)({hotId: hotId, key: 'type'})
  },
  getAllHotColumnPropertyFromHotId: (state, getters) => (property) => {
    const hotId = property.hotId
    const propertyKey = property.key
    if (!state.hotTabs[hotId].columnProperties) {
      state.hotTabs[hotId].columnProperties = []
      // return
    }
    let values = state.hotTabs[hotId].columnProperties.map(column => {
      let value = column[propertyKey]
      return column[propertyKey]
    })
    return values
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
  getSyncHotIdFromTabId: (state, getters) => (tabId) => {
    let hotId = _.findKey(state.hotTabs, {tabId: tabId})
    return hotId
  },
  getProvenance: state => {
    return state.provenanceProperties
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
    return state.packageProperties[property.key]
  },
  getPackageProperties: state => {
    return state.packageProperties
  },
  getConstraint: (state, getters) => (property) => {
    let hotColumnProperties = getHotColumnPropertiesFromPropertyObject(property)
    let constraints = hotColumnProperties['constraints']
    if (!constraints) {
      constraints = state.hotTabs[property.hotId].columnProperties[property.columnIndex].constraints = {}
    }
    return constraints[property.key]
  },
  // ensure no caching
  getAllForeignKeys: (state, getters) => () => {
    let allForeignKeys = {}
    for (let hotId in state.hotTabs) {
      let tableProperties = state.hotTabs[hotId].tableProperties || {}
      let foreignKeys = tableProperties.foreignKeys || []
      allForeignKeys[hotId] = foreignKeys
    }
    return allForeignKeys
  }
}

const mutations = {
  pushProvenance(state, value) {
    _.set(state.provenanceProperties, 'markdown', value)
  },
  pushProvenanceErrors(state, value) {
    _.set(state.provenanceProperties, 'errors', value)
  },
  removeProvenanceErrors(state, key) {
    _.set(state.provenanceProperties, 'errors', '')
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
  pushHotSelection(state, property) {
    _.set(state.hotTabs, `${property.hotId}.selected`, property.selected)
  },
  pushAllColumnsProperty(state, properties) {
    for (const [index, value] of properties.values.entries()) {
      let property = {
        hotId: properties.hotId,
        columnIndex: index,
        key: properties.key,
        value: value
      }
      mutations.pushColumnProperty(state, property)
    }
  },
  pushColumnProperty(state, property) {
    _.set(state.hotTabs, `${property.hotId}.columnProperties[${property.columnIndex}].${property.key}`, property.value)
  },
  pushTableProperty(state, property) {
    _.set(state.hotTabs, `${property.hotId}.tableProperties.${property.key}`, property.value)
  },
  pushForeignKeysLocalFieldsForTable(state, property) {
    let tableProperties = _.assign({}, state.hotTabs[property.hotId].tableProperties) || {}
    let foreignKeys = tableProperties.foreignKeys || []
    if (!foreignKeys[property.index]) {
      foreignKeys[property.index] = {
        fields: [],
        reference: {
          resource: '',
          fields: []
        }
      }
    }
    foreignKeys[property.index].fields = property.fields
    state.hotTabs[property.hotId].tableProperties.foreignKeys = foreignKeys
  },
  pushForeignKeysForeignTableForTable(state, property) {
    let tableProperties = _.assign({}, state.hotTabs[property.hotId].tableProperties) || {}
    let foreignKeys = tableProperties.foreignKeys || []
    if (!foreignKeys[property.index]) {
      foreignKeys[property.index] = {
        fields: [],
        reference: {
          resource: '',
          fields: []
        }
      }
    }
    foreignKeys[property.index].reference.resource = property.resource
    state.hotTabs[property.hotId].tableProperties.foreignKeys = foreignKeys
    // _.set(state.hotTabs, `${property.hotId}.tableProperties.foreignKeys`, property.foreignKeys)
  },
  pushForeignKeysForeignFieldsForTable(state, property) {
    let tableProperties = _.assign({}, state.hotTabs[property.hotId].tableProperties) || {}
    let foreignKeys = tableProperties.foreignKeys || []
    if (!foreignKeys[property.index]) {
      foreignKeys[property.index] = {
        fields: [],
        reference: {
          resource: '',
          fields: []
        }
      }
    }
    foreignKeys[property.index].reference.fields = property.fields
    state.hotTabs[property.hotId].tableProperties.foreignKeys = foreignKeys
  },
  pushPackageProperty(state, property) {
    _.set(state.packageProperties, property.key, property.value)
  },
  pushTableSchema(state, hotIdSchema) {
    let hotId = hotIdSchema.hotId
    let hotTab = state.hotTabs[hotId]
    mutations.initColumnProperties(state, hotTab)
    // we cannot mutate the vuex state itself (in lodash call) - we can only assign a new value
    let columnProperties = []
    for (let column of hotTab.columnProperties) {
      let nextObject = {}
      columnProperties.push(nextObject)
      _.assign(nextObject, column)
    }
    _.merge(columnProperties, hotIdSchema.schema.descriptor.fields)
    state.hotTabs[hotId].columnProperties = columnProperties
    return state.hotTabs[hotId].columnProperties
  },
  initColumnProperties(state, hotTab) {
    if (typeof hotTab.columnProperties === 'undefined' || !hotTab.columnProperties) {
      hotTab.columnProperties = []
    }
  },
  initMissingValues(state, hotTab) {
    mutations.initTableProperties(state, hotTab)
    if (typeof hotTab.tableProperties.missingValues === 'undefined' || !hotTab.tableProperties.missingValues) {
      hotTab.tableProperties.missingValues = ['']
    }
  },
  initTableProperties(state, hotTab) {
    if (typeof hotTab.tableProperties === 'undefined' || !hotTab.tableProperties) {
      hotTab.tableProperties = []
    }
  },
  destroyHotTab(state, hotId) {
    _.unset(state.hotTabs, hotId)
  },
  async destroyHotTabFromTabId(state, tabId) {
    let hotId = await getters.getHotIdFromTabId(tabId)
    _.unset(state.hotTabs, hotId)
  },
  resetAllColumnPropertiesForHotId(state, hotId) {
    if (state.hotTabs[hotId].columnProperties) {
      state.hotTabs[hotId].columnProperties.length = 0
    } else {
      state.hotTabs[hotId].columnProperties = []
    }
  },
  resetColumnPropertiesForHotId(state, property) {
    state.hotTabs[property.hotId].columnProperties[property.columnIndex] = {}
  },
  removeColumnIndexForHotId(state, property) {
    let columnProperties = state.hotTabs[property.hotId].columnProperties
    if (typeof columnProperties !== 'undefined' && columnProperties.length > property.columnIndex) {
      state.hotTabs[property.hotId].columnProperties.splice(property.columnIndex, 1)
    }
  },
  pushColumnIndexForHotId(state, property) {
    let columnProperties = state.hotTabs[property.hotId].columnProperties
    if (typeof columnProperties == 'undefined') {
      state.hotTabs[property.hotId].columnProperties = []
    }
    state.hotTabs[property.hotId].columnProperties.splice(property.columnIndex, 0, {})
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
  },
  resetAll(state) {
    state = {
      hotTabs: {},
      packageProperties: {},
      provenanceProperties: { markdown: '' }
    }
  }
}

export default {
  state,
  getters,
  mutations
}
