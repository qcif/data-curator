<template>
<div id="foreignKeyFields">
  <div v-for="(foreignKey,index) in hotForeignKeys"  class="foreign col-sm-12">
    <div class="inputs-container">
      <component :key="getLocalComponentKey(index)" is="tableheaderkeys" :activeNames="localHeaderNames" :getSelectedKeys="getSelectedLocalKeys(index)" :pushSelectedKeys="pushSelectedLocalKeys(index,currentLocalHotId)" />
      <component v-show="isHeadersSelected" :key="getTableComponentKey(index)" is="tablekeys" :allTableNames="allTableNames" :getSelectedTable="getSelectedTable(index)" :pushSelectedTable="pushSelectedForeignTable(index,currentLocalHotId)" />
      <component v-show="isHeadersSelected" :key="getForeignComponentKey(index)" is="tableheaderkeys" :activeNames="foreignHeaderNames" :getSelectedKeys="getSelectedForeignKeys(index)" :pushSelectedKeys="pushSelectedForeignKeys(index,currentLocalHotId)"/>
    </div>
    <button v-show="getAllForeignKeysFromCurrentHotId.length > 1" type="button" class="btn btn-danger btn-sm" @click="removeForeignKey(index)">
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
  Observable
} from 'rxjs/Observable'
import 'rxjs/add/operator/debounce'
import 'rxjs/add/observable/timer'
import {
  allTabsTitles$,
  selectedForeignTable$,
  allTablesAllColumnNames$,
  selectedForeignLocalHeaders$
  // pushEmptyForeignKey$
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
        console.log('current foreign keys are:')
        console.log(foreignKeys)
        if (!foreignKeys) {
          console.log('resetting foreign keys')
          foreignKeys = [this.emptyForeignKey]
          this.pushSelectedLocalKeys(0, hotId)(foreignKeys[0])
        }
        console.log(`all foreign keys:`)
        console.log(foreignKeys)
        return foreignKeys
      },
      watch() {
        let dummy = this.localHeaderNames
        let dummy2 = this.getActiveTab
      }
    },
    localHotId: {
      async get() {
        let hotId = await this.currentHotId()
        return hotId
      },
      watch() {

      }
    }
  },
  data() {
    return {
      localHeaderNames: [],
      foreignHeaderNames: [],
      currentLocalHotId: '',
      allForeignKeys: {},
      allTableNames: [],
      allTabTableNames: [],
      allTableNamesHeaderNames: {},
      debounceGetSelectedForeignKeys: _.debounce(this.getSelectedForeignKeys, 200, {
        'leading': false,
        'trailing': true
      })

    }
  },
  computed: {
    emptyForeignKey() {
      return {
        fields: [],
        reference: {
          resource: '',
          fields: []
        }
      }
    },
    isHeadersSelected() {
      return this.localHeaderNames.length > 0
    },
    getAllForeignKeysFromCurrentHotId() {
      return this.allForeignKeys[this.currentLocalHotId]
    }
  },
  subscriptions() {
    return {
      allColumns: allTablesAllColumnNames$
    }
  },
  methods: {
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
      let foreignKeys = this.getAllForeignKeysFromCurrentHotId
      foreignKeys.splice(index, 1)
      this.setProperty(this.propertyName, foreignKeys)
    },
    addForeignKey: function() {
      // this.getAllForeignKeysFromCurrentHotId[index]
      let foreignKeys = this.getAllForeignKeysFromCurrentHotId
      foreignKeys.push(this.emptyForeignKey)
      this.setProperty(this.propertyName, foreignKeys)
    },
    getHotIdFromTabTitle: function(tableName) {
      let tabId = _.findKey(this.allTabTableNames, function(o) {
        return o === tableName
      })
      let hotId = this.getTabId(tabId)
      return hotId
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
    getTabsTableNames: function(allTabsTableNames) {
      let tableNames = []
      _.forEach(allTabsTableNames, function(name, tabId) {
        tableNames.push(name)
      })
      return _.pull(tableNames, '', null, undefined)
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
        let foreignHeaderNames = vueGetHotIdHeaderNames(vueAllColumns, hotId)
        console.log('next set of foreign header names are:')
        console.log(foreignHeaderNames)
        allTableNamesHeaderNames[tabTitle] = foreignHeaderNames
      })
      this.allTableNamesHeaderNames = _.assign({}, allTableNamesHeaderNames)
      console.log('all tables names header names:')
      console.log(this.allTableNamesHeaderNames)
    },
    enableComponent: function(value) {
      console.log('checking enable component...')
      let hasValue = false
      if (value) {
        if (typeof value === 'string') {
          hasValue = value.trim() !== ''
        } else {
          hasValue = !_.isEmpty(value)
        }
      }
      return hasValue
    },
    getSelectedLocalKeys: function(index) {
      let foreignKey = this.getAllForeignKeysFromCurrentHotId[index]
      console.log(`foreign key is`)
      console.log(foreignKey)
      console.log(`index is ${index}`)
      let headers = foreignKey.fields || []
      console.log('fields are:')
      console.log(headers)
      return headers
    },
    getSelectedForeignKeys2: function(index) {
      return this.debounceGetSelectedForeignKeys(index)
    },
    getSelectedForeignKeys: function(index) {
      let foreignKey = this.getAllForeignKeysFromCurrentHotId[index]
      console.log('foreign key got selected is:')
      console.log(foreignKey)
      let headers = foreignKey.reference.fields || []
      console.log('foreign fields are:')
      console.log(headers)
      return headers
    },
    getSelectedTable: function(index) {
      let foreignKey = this.getAllForeignKeysFromCurrentHotId[index]
      let table = foreignKey.reference.resource
      if (!table) {
        table = this.allTableNames[0]
        console.log('resetting...')
        this.pushSelectedForeignTable(index, this.currentLocalHotId)(table)
      }
      console.log('table is:')
      console.log(table)
      selectedForeignTable$.next(table)
      return function() {
        return table
      }
    },
    pushSelectedLocalKeys: function(index, hotId) {
      console.log(`hot id in push selected local keys is ${hotId}`)
      console.log('pushing selected local keys...')
      let vueSetProperty = this.pushForeignKeysLocalFieldsForTable
      return function(headers) {
        selectedForeignLocalHeaders$.next(headers.length > 0)
        let object = { hotId: hotId, index: index, fields: headers }
        console.log('local object to set is')
        console.log(object)
        vueSetProperty(object)
      }
    },
    updateForeignHeaderNames: function(table) {
      this.foreignHeaderNames = this.allTableNamesHeaderNames[table]
      console.log('updated foreign header names are now:')
      console.log(this.foreignHeaderNames)
    },
    pushSelectedForeignTable: function(index, hotId) {
      console.log('entering push selected foreign table...')
      console.log(`index is ${index}`)
      console.log(`hot id is ${hotId}`)
      let vueSetProperty = this.pushForeignKeysForeignTableForTable
      let vueForceUpdate = this.forceUpdateWrapper
      return function(value) {
        console.log('entering value set for selected foreign table...')
        selectedForeignTable$.next(value)
        let object = { hotId: hotId, index: index, resource: value }
        console.log('foreign table object to set is')
        console.log(object)
        vueSetProperty(object)
      }
    },
    pushSelectedForeignKeys: function(index, hotId) {
      console.log(`hot id in push selected foreign keys is ${hotId}`)
      let vueSetProperty = this.pushForeignKeysForeignFieldsForTable
      return function(headers) {
        let object = { hotId: hotId, index: index, fields: headers }
        console.log('foreign keys object to set is')
        console.log(object)
        vueSetProperty(object)
      }
    },
    forceUpdateWrapper: function() {
      this.$forceUpdate()
    }

  },
  created: function() {
    let vueUpdateTableSubscriptions = this.updateTableSubscriptions
    this.$subscribeTo(allTabsTitles$, async function(allTabsTitles) {
      vueUpdateTableSubscriptions(allTabsTitles)
    })
    let vueUpdateForeignHeaderNames = this.updateForeignHeaderNames

    this.$subscribeTo(selectedForeignTable$.debounce(() => Observable.timer(100)), function(selectedForeignTable) {
      vueUpdateForeignHeaderNames(selectedForeignTable)
    })
  },
  watch: {
  },
  mounted: function() {
    pushAllTabTitlesSubscription()
  }
}
</script>
<style lang="styl" scoped>
@import '~static/css/foreignkeys'
</style>
