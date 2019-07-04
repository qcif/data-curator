import store from '@/store'
export function resetHotStore () {
  store.replaceState({
    hotTabs: {},
    packageProperties: {},
    provenanceProperties: { markdown: '' }
  })
}

// note that the layout here is different (flattened and simpler) than the actual store
export function stubSimpleTabStore (hot) {
  const stubbedStore = {
    state: {
      tabs: [],
      activeTab: '',
      tabObjects: {},
      tabIndex: -1,
      activeTitle: '',
      hotTabs: {},
      hot: hot
    },

    getters: {
      getTabs: state => {
        return ['tab0']
      },
      getActiveTab: state => {
        return 'tab0'
      },
      tabTitle: (state, getters) => (tabId) => {
        return `title`
      },
      getTabIndex: state => {
        return 0
      },
      getHotSelection: (state, getters) => (hotId) => {
        return [0, 0, 0, 0]
      },
      getHotColumnProperty: (state, getters) => (property) => {
        let hotColumnProperties = {}
        return hotColumnProperties[property.key]
      },
      getHotIdFromTabId: (state, getters) => (tabId) => {
        return state.hot
      },
      getAllHotTablesColumnNames: (state, getters) => () => {
        return ['stubbed Column names']
      },
      getAllHotColumnPropertiesFromHotId: (state, getters) => (hotId) => {
        // init for other functions that may need this initialisation
        state.hotTabs[hotId] = {}
        state.hotTabs[hotId].columnProperties = {}
        return {}
      },
      getTableProperty: (state, getters) => (property) => {
        let tableProperties = {}
        return tableProperties[property.key]
      }
    },
    mutations: {
      pushTabTitle (state, tab) {
        _.set(state.tabObjects, `tab0.title`, 'title')
      },
      incrementTabIndex (state) {
        state.tabIndex++
      },
      setActiveTab (state, tabId) {
        state.activeTitle = 'title'
      },
      pushTab (state, tabId) {
        state.tabs.push('tab0')
      },
      pushPackageProperty (state, property) {
        _.set(state.packageProperties, property.key, property.value)
      },
      pushHotTab (state, hotTab) {
        _.set(state.hotTabs, `${hotTab.hotId}.tabId`, hotTab.tabId)
      },
      pushTableProperty (state, property) {
        _.set(state.hotTabs, `${property.hotId}.tableProperties.${property.key}`, property.value)
      },
      pushHotSelection (state, property) {
        _.set(state.hotTabs, `${property.hotId}.selected`, property.selected)
      },
      pushColumnProperty (state, property) {
        _.set(state.hotTabs, `${property.hotId}.columnProperties[${property.columnIndex}].${property.key}`, property.value)
      },
      resetTablePropertiesToObject (state, hotIdTables) {
        for (let hotId in hotIdTables) {
          if (!state.hotTabs[hotId]) {
            throw new Error(`Unable to find tab with hot id: ${hotId}`)
          }
          _.set(state.hotTabs[hotId], 'tableProperties', hotIdTables[hotId])
        }
      }
    }
  }
  return stubbedStore
}
