<template>
<div id="foreignKeyFields">
  <div v-for="(foreignKey,index) in hotForeignKeys"  class="foreign col-sm-12">
    <div class="inputs-container">
      <component :key="getLocalComponentKey(index)" is="tableheaderkeys" :activeNames="localHeaderNames" :getSelectedKeys="getSelectedLocalKeys(index)" :pushSelectedKeys="pushSelectedLocalKeys(index,currentLocalHotId)" labelName="Foreign key(s)" tooltipId="tooltip-foreignkey" tooltipView="tooltipForeignkey" />
      <component v-show="isHeadersSelected" :key="getTableComponentKey(index)" is="tablekeys" :allTableNames="allTableNames" :getSelectedTable="getSelectedTable(index)" :pushSelectedTable="pushSelectedForeignTable(index,currentLocalHotId)" labelName="Reference Table" tooltipId="tooltip-foreignkey-table" tooltipView="tooltipForeignkeyTable"/>
      <component v-show="isHeadersSelected" :key="getForeignComponentKey(index)" is="tableheaderkeys" :activeNames="getCurrentForeignHeaders(index)" :getSelectedKeys="getSelectedForeignKeys(index)" :pushSelectedKeys="pushSelectedForeignKeys(index,currentLocalHotId)" labelName="Reference Column(s)" tooltipId="tooltip-foreignkey-tablekey" tooltipView="tooltipForeignkeyTablekey" />
    </div>
    <button type="button" class="btn btn-danger btn-sm" @click="removeForeignKey(index)">
      <span class="glyphicon glyphicon-minus"/>
    </button>
  </div>
  <div class="button-container">
    <button type="button" class="add-foreign btn btn-primary btn-sm" @click="addForeignKey()">
      <span class="glyphicon glyphicon-plus"/>Add Foreign Key
    </button>
  </div>
</div>
</template>
<script>
import tablekeys from '../partials/TableKeys'
import tableheaderkeys from '../partials/TableHeaderKeys'
import RelationKeys from '../mixins/RelationKeys'
import ForeignKeysTooltip from '../mixins/ForeignKeysTooltip'
import {
  pushAllTabTitlesSubscription
} from '@/store/modules/tabs.js'
import {
  mapMutations,
  mapGetters
} from 'vuex'
import {
  Subscription
} from 'rxjs/Subscription'
import {
  allTabsTitles$,
  allTablesAllColumnNames$
} from '@/rxSubject.js'
import VueRx from 'vue-rx'
import Vue from 'vue'
Vue.use(VueRx, {
  Subscription
})
export default {
  components: {
    tablekeys,
    tableheaderkeys
  },
  mixins: [RelationKeys],
  name: 'foreignkeys',
  props: ['setProperty', 'getPropertyGivenHotId', 'propertyName', 'currentHotId'],
  asyncComputed: {
    hotForeignKeys: {
      async get() {
        console.log('getting async hot foreign keys...')
        let hotId = await this.currentHotId()
        this.currentLocalHotId = hotId
        this.allForeignKeys = this.getAllForeignKeys()
        let foreignKeys = this.allForeignKeys[hotId]
        return foreignKeys
      },
      watch() {
        let dummy = this.localHeaderNames
        let dummy2 = this.getActiveTab
      }
    }
  },
  data() {
    return {
      localHeaderNames: [],
      foreignTableNames: [],
      currentLocalHotId: '',
      allForeignKeys: {},
      allTableNames: [],
      allTabTableNames: [],
      allTableNamesHeaderNames: {}
    }
  },
  computed: {
    isHeadersSelected() {
      let isSelected = this.localHeaderNames.length > 0
      return !!isSelected
    }
  },
  subscriptions() {
    return {
      allColumns: allTablesAllColumnNames$
    }
  },
  methods: {
    getAllForeignKeysFromCurrentHotId: function() {
      let currentHotId = this.currentLocalHotId
      console.log(`current hot id in 'foreignKeys.vue' is ${currentHotId}`)
      let allForeignKeys = this.getAllForeignKeys()
      let foreignKeys = allForeignKeys[currentHotId]
      return foreignKeys
    },
    getCurrentForeignHeaders: function(index) {
      let currentTable = this.getSelectedTable(index)
      console.log('returning current foreign headers...')
      console.log(this.allTableNamesHeaderNames)
      return this.allTableNamesHeaderNames[currentTable()]
    },
    getLocalComponentKey: function(index) {
      return `local${index}`
    },
    getTableComponentKey: function(index) {
      return `table${index}`
    },
    getForeignComponentKey: function(index) {
      return `foreign${index}`
    },
    removeForeignKey: function(index) {
      let foreignKeys = this.getAllForeignKeysFromCurrentHotId()
      foreignKeys.splice(index, 1)
      this.setProperty(this.propertyName, foreignKeys)
    },
    addForeignKey: function() {
      let foreignKeys = this.getAllForeignKeysFromCurrentHotId()
      console.log('adding foreign key. Current foreign keys...')
      console.log(foreignKeys)
      foreignKeys.push({
        fields: [],
        reference: {
          resource: '',
          fields: []
        }
      })
      this.setProperty(this.propertyName, foreignKeys)
      this.initTableHeaderKeys()
    },
    updateSubscriptions: async function(allTablesAllColumnNames) {
      console.log('updated subscriptions in foreign keys...')
      console.log(allTablesAllColumnNames)
      try {
        let localHotId = await this.currentHotId()
        console.log(`local hot id in update subscriptions is ${localHotId}`)
        this.localHeaderNames.length = 0
        let headerNames = this.getHotIdHeaderNames(allTablesAllColumnNames, localHotId)
        console.log('header names are:')
        console.log(headerNames)
        this.localHeaderNames.push(...headerNames)
      } catch (err) {
        console.log('Problem with updating subscriptions', err)
      }
    },
    updateTableSubscriptions: function(allTabsTitles) {
      this.allTableNames = this.getTabsTableNames(allTabsTitles)
      this.allTabTableNames = allTabsTitles
      console.log(`all table names are:`)
      console.log(this.allTableNames)
      console.log('all tab titles are:')
      console.log(this.allTabTableNames)
      let vueGetHotIdFromTabTitle = this.getHotIdFromTabTitle
      let vueGetHotIdHeaderNames = this.getHotIdHeaderNames
      let vueAllColumns = this.allColumns
      let allTableNamesHeaderNames = {}
      _.forEach(this.allTableNames, function(tabTitle) {
        let hotId = vueGetHotIdFromTabTitle(tabTitle)
        console.log(`hot id is ${hotId}`)
        let foreignHeaderNames = vueGetHotIdHeaderNames(vueAllColumns, hotId)
        allTableNamesHeaderNames[tabTitle] = foreignHeaderNames
      })
      this.allTableNamesHeaderNames = _.assign({}, allTableNamesHeaderNames)
      console.log('all tables names header names:')
      console.log(this.allTableNamesHeaderNames)
    },
    getTabsTableNames: function(allTabsTableNames) {
      let tableNames = []
      _.forEach(allTabsTableNames, function(name, tabId) {
        tableNames.push(name)
      })
      return _.pull(tableNames, '', null, undefined)
    },
    getHotIdFromTabTitle: function(tableName) {
      let tabId = _.findKey(this.allTabTableNames, function(o) {
        return o === tableName
      })
      let hotId = this.getTabId(tabId)
      return hotId
    },
    getSelectedLocalKeys: function(index) {
      let foreignKeys = this.getAllForeignKeysFromCurrentHotId()
      console.log(`received foreign keys in 'get selected local keys'`)
      console.log(foreignKeys)
      let foreignKey = foreignKeys[index] || {}
      let headers = foreignKey.fields || []
      return headers
    },
    getSelectedTable: function(index) {
      let foreignKeys = this.getAllForeignKeysFromCurrentHotId()
      let foreignKey = foreignKeys[index] || {}
      let reference = foreignKey.reference || {}
      let table = reference.resource || this.getCurrentTitle()
      console.log('table is:')
      console.log(table)
      return function() {
        console.log('updating for selected table')
        console.log(`index is ${index}`)
        console.log(`table is ${table}`)
        return table
      }
    },
    getSelectedForeignKeys: function(index) {
      let foreignKeys = this.getAllForeignKeysFromCurrentHotId()
      let foreignKey = foreignKeys[index] || {}
      let reference = foreignKey.reference || {}
      let headers = reference.fields || []
      console.log('foreign fields are:')
      console.log(headers)
      return headers
    },
    pushSelectedLocalKeys: function(index, hotId) {
      let vueSetProperty = this.pushForeignKeysLocalFieldsForTable
      return function(headers) {
        let object = { hotId: hotId, index: index, fields: headers }
        console.log('local object to set is')
        console.log(object)
        vueSetProperty(object)
      }
    },
    pushSelectedForeignTable: function(index, hotId) {
      let vueSetProperty = this.pushForeignKeysForeignTableForTable
      let vueGetCurrentTitle = this.getCurrentTitle
      return function(table) {
        let activeTitle = vueGetCurrentTitle()
        if (activeTitle === table) {
          table = ''
        }
        let object = { hotId: hotId, index: index, resource: table }
        console.log('foreign table object to set is')
        console.log(object)
        vueSetProperty(object)
      }
    },
    pushSelectedForeignKeys: function(index, hotId) {
      let vueSetProperty = this.pushForeignKeysForeignFieldsForTable
      return function(headers) {
        let object = { hotId: hotId, index: index, fields: headers }
        console.log('foreign keys object to set is')
        console.log(object)
        vueSetProperty(object)
      }
    },
    getCurrentTitle: function() {
      return this.tabTitle(this.getActiveTab)
    }
  },
  created: function() {
    let vueUpdateTableSubscriptions = this.updateTableSubscriptions
    this.$subscribeTo(allTabsTitles$, function(allTabsTitles) {
      vueUpdateTableSubscriptions(allTabsTitles)
    })
  },
  mounted: function() {
    pushAllTabTitlesSubscription()
  }
}
</script>
<style lang="styl" scoped>
@import '~static/css/foreignkeys'
</style>
