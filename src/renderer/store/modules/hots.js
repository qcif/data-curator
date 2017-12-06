const state = {
  hotTabs: {},
  packageProperties: {},
  provenanceProperties: {}
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
  getAllHotColumnPropertiesFromHotId: (state, getters) => (hotId) => {
    // console.log('entered getAllHotColumnPropertiesFromHotId')
    // console.log(state.hotTabs)
    return state.hotTabs[hotId].columnProperties || []
  },
  // ensure getter fires each time by passing in function
  getAllHotTablesColumnNames: (state, getters) => () => {
    // console.log('entered get all hot table column names function...')
    let hotIdColumnNames = {}
    for (let hotId in state.hotTabs) {
      // console.log(`next hot id is ${hotId}`)
      let columnProps = state.hotTabs[hotId].columnProperties || []
      let columnNames = columnProps.map(column => {
        return column.name
      })
      // console.log(`names are`)
      // console.log(columnNames)
      hotIdColumnNames[hotId] = columnNames
    }
    // console.log(`hot id column names are...`)
    // console.log(hotIdColumnNames)
    return hotIdColumnNames
  },
  getAllHotColumnNamesFromHotId: (state, getters) => (hotId) => {
    // console.log('triggered get all hot column names...')
    // console.log(`hot id is: ${hotId}`)
    if (!state.hotTabs[hotId].columnProperties) {
      state.hotTabs[hotId].columnProperties = []
      // console.log('not hot columns set. aborting...')
      // return
    }
    let names = state.hotTabs[hotId].columnProperties.map(column => {
      let name = column.name
      // console.log(`returning column name: ${name}`)
      return column.name
    })
    // console.log(`returning active hot all column names`)
    // console.log(names)
    return names
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
    // console.log('incoming table property for table property get...')
    // console.log(property)
    console.log('attempting to fetch table properties...')
    console.log(property)
    console.log(state.hotTabs[property.hotId])
    let tableProperties = state.hotTabs[property.hotId].tableProperties || {}
    return tableProperties[property.key]
  },
  getPackageProperty: (state, getters) => (property) => {
    return state.packageProperties[property.key]
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
    // console.log('all push complete')
    // console.log(state.hotTabs)
  },
  pushColumnProperty(state, property) {
    // console.log(`incoming property is...`)
    // console.log(property)
    _.set(state.hotTabs, `${property.hotId}.columnProperties[${property.columnIndex}].${property.key}`, property.value)
    console.log('pushed column property complete')
    console.log(state.hotTabs)
  },
  pushTableProperty(state, property) {
    _.set(state.hotTabs, `${property.hotId}.tableProperties.${property.key}`, property.value)
    // console.log(`table property:`)
    // console.log(property)
    // console.log('pushed...')
    // console.log(state.hotTabs)
  },
  // TODO : schema fields has simply been incorporated into overwriting column properties - remove legacy methods
  pushTableSchemaProperty(state, property) {
    mutations.pushTableProperty(state, property)
  },
  // deprecated
  pushTableSchemaDescriptorProperty(state, property) {
    mutations.pushTableProperty(state, property)
  },
  pushPackageProperty(state, property) {
    _.set(state.packageProperties, property.key, property.value)
    console.log('package properties pushed...')
    console.log(state)
  },
  pushMissingValues(state, hotMissingValues) {
    let hotId = hotMissingValues.hotId
    _.set(state.hotTabs, `${hotId}.tableProperties.missingValues`, hotMissingValues.missingValues)
  },
  pushTableSchema(state, hotTable) {
    let isColumnPropertiesMerged = mutations.mergeTableSchemaOverCurrentColumnProperties(state, hotTable)
    return isColumnPropertiesMerged
  },

  mergeTableSchemaOverCurrentColumnProperties(state, hotIdSchema) {
    let hotId = hotIdSchema.hotId
    let hotTab = state.hotTabs[hotId]
    if (!hotTab.columnProperties) {
      hotTab.columnProperties = []
    }
    // we cannot mutate the vuex state itself (in lodash call) - we can only assign a new value
    let columnProperties = [...hotTab.columnProperties]
    let isMerged = _.merge(columnProperties, hotIdSchema.schema.descriptor.fields)
    state.hotTabs[hotId].columnProperties = columnProperties
    return isMerged
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
