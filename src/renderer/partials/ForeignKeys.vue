<template>
<div id="foreignKeyFields">
  <div v-for="(foreignKey,index) in hotForeignKeys"  class="foreign col-sm-12">
    <div class="inputs-container">
      <component :key="getLocalComponentKey(index)" is="tableheaderkeys" :activeNames="localHeaderNames" :getSelectedKeys="getSelectedLocalKeys(index)" :pushSelectedKeys="pushSelectedLocalKeys(index,currentLocalHotId)" />
      <component v-show="isHeadersSelected" :key="getTableComponentKey(index)" is="tablekeys" :allTableNames="allTableNames" :getSelectedTable="getSelectedTable(index)" :pushSelectedTable="pushSelectedForeignTable(index,currentLocalHotId)" />
      <component v-show="isHeadersSelected" :key="getForeignComponentKey(index)" is="tableheaderkeys" :activeNames="getCurrentForeignHeaders[index]" :getSelectedKeys="getSelectedForeignKeys(index)" :pushSelectedKeys="pushSelectedForeignKeys(index,currentLocalHotId)"/>
    </div>
    <button v-show="getAllForeignKeysFromCurrentHotId().length > 1" type="button" class="btn btn-danger btn-sm" @click="removeForeignKey(index)">
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
import 'rxjs/add/operator/startWith'
import 'rxjs/add/operator/debounceTime'
import 'rxjs/add/operator/delay'
import 'rxjs/add/observable/fromPromise'
import {
  allTabsTitles$,
  // selectedForeignTable$,
  allTablesAllColumnNames$,
  selectedForeignLocalHeaders$,
  currentForeignHeaders$
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
      // foreignHeaderNames: [],
      currentForeignHeaders: [],
      foreignTableNames: [],
      currentLocalHotId: '',
      allForeignKeys: {},
      allTableNames: [],
      allTabTableNames: [],
      allTableNamesHeaderNames: {}
      // debounceGetSelectedForeignKeys: _.debounce(this.getSelectedForeignKeys, 200, {
      //   'leading': false,
      //   'trailing': true
      // }),
      // debounceUpdateCurrentForeignHeaders: _.debounce(this.updateCurrentForeignHeaders, 500, {
      //   'leading': false,
      //   'trailing': true
      // })

    }
  },
  computed: {
    isHeadersSelected() {
      let isSelected = this.localHeaderNames.length > 0
      return !!isSelected
    }
  },
  subscriptions() {
    let vueGetLatestForeignHeader = this.getPromisedForeignHeader
    return {
      allColumns: allTablesAllColumnNames$,
      getCurrentForeignHeaders: currentForeignHeaders$.startWith(Observable.fromPromise(vueGetLatestForeignHeader()))
    }
  },
  methods: {
    getAllForeignKeysFromCurrentHotId: function() {
      // this.getAllForeignKeys()
      let currentHotId = this.currentLocalHotId
      let allForeignKeys = this.getAllForeignKeys()
      let foreignKeys = allForeignKeys[currentHotId]
      return [...foreignKeys]
    },
    getPromisedForeignHeader: function() {
      let vueGetLatestForeignHeader = this.getLatestForeignHeader
      return new Promise((resolve, reject) => {
        let foreignHeader = vueGetLatestForeignHeader()
        if (!foreignHeader) {
          // There is a short render wait in home page, so if hotId not first returned, just wait and try again
          _.delay(function(foreignHeader) {
            resolve(vueGetLatestForeignHeader())
          }, 200, foreignHeader)
        } else {
          resolve(foreignHeader)
        }
      })
    },
    getLatestForeignHeader: function() {
      let foreignHeader = _.last(this.currentForeignHeaders)
      console.log('last foreign header')
      console.log(foreignHeader)
      return foreignHeader
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
      this.currentForeignHeaders.splice(index, 1)
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
      // this.currentForeignHeaders.push([])
      this.initTableHeaderKeys()
      // let vueInitTableHeaderKeys = this.initTableHeaderKeys
      // this.$nextTick(function() {
      //   vueInitTableHeaderKeys()
      // })
      // this.$forceUpdate()
    },
    getHotIdFromTabTitle: function(tableName) {
      let tabId = _.findKey(this.allTabTableNames, function(o) {
        return o === tableName
      })
      let hotId = this.getTabId(tabId)
      return hotId
    },
    updateSubscriptions: async function(allTablesAllColumnNames) {
      // this.currentForeignHeaders = []
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
        console.log(`hot id is ${hotId}`)
        let foreignHeaderNames = vueGetHotIdHeaderNames(vueAllColumns, hotId)
        allTableNamesHeaderNames[tabTitle] = foreignHeaderNames
      })
      this.allTableNamesHeaderNames = _.assign({}, allTableNamesHeaderNames)
      console.log('all tables names header names:')
      console.log(this.allTableNamesHeaderNames)
    },
    getSelectedLocalKeys: function(index) {
      let foreignKey = this.getAllForeignKeysFromCurrentHotId()[index]
      console.log(`foreign key is`)
      console.log(foreignKey)
      console.log(`index is ${index}`)
      let headers = foreignKey.fields || []
      console.log('fields are:')
      console.log(headers)
      return headers
    },
    // getSelectedForeignKeys2: function(index) {
    //   return this.debounceGetSelectedForeignKeys(index)
    // },
    getSelectedForeignKeys: function(index) {
      let foreignKey = this.getAllForeignKeysFromCurrentHotId()[index]
      console.log('foreign key got selected is:')
      console.log(foreignKey)
      let headers = foreignKey.reference.fields
      console.log('foreign fields are:')
      console.log(headers)
      return headers
    },
    getSelectedTable: function(index) {
      let foreignKey = this.getAllForeignKeysFromCurrentHotId()[index]
      let table = foreignKey.reference.resource || this.allTableNames[0]
      // if (!table) {
      //   table = this.allTableNames[0]
      // console.log('resetting...')
      //   this.pushSelectedForeignTable(index, this.currentLocalHotId)(table)
      // }
      console.log('table is:')
      console.log(table)
      // if (foreignTableNames[index] !=== table) {
      //   console.log('checking in get...')
      //   foreignTableNames[index] = table
      // }
      // this.updateForeignTableNames(index, table)
      // currentForeignHeaders$.next(this.allTableNamesHeaderNames[table])
      let vueUpdateCurrentForeignHeaders = this.updateCurrentForeignHeaders
      return function() {
        console.log('updating for selected table')
        console.log(`index is ${index}`)
        console.log(`table is ${table}`)
        vueUpdateCurrentForeignHeaders(index, table)
        return table
      }
    },
    pushSelectedLocalKeys: function(index, hotId) {
      let vueSetProperty = this.pushForeignKeysLocalFieldsForTable
      return function(headers) {
        selectedForeignLocalHeaders$.next(headers.length > 0)
        let object = { hotId: hotId, index: index, fields: headers }
        console.log('local object to set is')
        console.log(object)
        vueSetProperty(object)
      }
    },
    // updateForeignTableNames: function(index) {
    //   this.foreignTableNames[index] = table
    //   // selectedForeignTable$.next(this.foreignTableNames)
    // },
    updateCurrentForeignHeaders: function(index, table) {
      console.log('updating current foreign headers...')
      this.currentForeignHeaders[index] = this.allTableNamesHeaderNames[table]
      console.log(this.currentForeignHeaders)
      // this.initTableHeaderKeys()
      currentForeignHeaders$.next(this.currentForeignHeaders)
      // let currentForeignHeaders = this.currentForeignHeaders
      // _.delay(function() {
      //   console.log('triggered...')
      //   currentForeignHeaders$.next(currentForeignHeaders)
      // }, 1000)
    },
    pushSelectedForeignTable: function(index, hotId) {
      let vueSetProperty = this.pushForeignKeysForeignTableForTable
      // let vueForceUpdate = this.forceUpdateWrapper
      // let vueUpdateForeignTableNames = this.updateForeignTableNames
      let vueUpdateCurrentForeignHeaders = this.updateCurrentForeignHeaders
      return function(table) {
        let object = { hotId: hotId, index: index, resource: table }
        console.log('foreign table object to set is')
        console.log(object)
        vueSetProperty(object)
        vueUpdateCurrentForeignHeaders(index, table)
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
    // forceUpdateWrapper: function() {
    //   this.$forceUpdate()
    // },
    getAllTableNamesHeaderNames: function(table) {
      return this.allTableNamesHeaderNames[table]
    }

  },
  created: function() {
    let vueUpdateTableSubscriptions = this.updateTableSubscriptions
    this.$subscribeTo(allTabsTitles$, async function(allTabsTitles) {
      vueUpdateTableSubscriptions(allTabsTitles)
    })
  },
  watch: {
    // currentForeignHeaders: function(foreignHeaders) {
    //   console.log('got current foreign headers...')
    //   currentForeignHeaders$.next(foreignHeaders)
    // }
  },
  mounted: function() {
    pushAllTabTitlesSubscription()
  }
}
</script>
<style lang="styl" scoped>
@import '~static/css/foreignkeys'
</style>
