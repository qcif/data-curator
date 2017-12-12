<template>
<div id="foreignKeyFields">
  <div v-for="(foreignKey,index) in hotForeignKeys" :key="index" class="foreign col-sm-12">
    <div class="inputs-container">
      <component is="tableheaderkeys" :activeNames="localHeaderNames" :getSelectedKeys="getSelectedKeys(index)" :pushSelectedKeys="pushSelectedLocalKeys(index,currentLocalHotId)" />
      <component v-show="isHeadersSelected" is="tablekeys" :allTableNames="allTableNames" :getSelectedTable="getSelectedTable(index)" :pushSelectedTable="pushSelectedForeignTable(index,currentLocalHotId)" />
      <component v-show="isHeadersSelected" is="tableheaderkeys" :activeNames="foreignHeaderNames" :getSelectedKeys="getSelectedForeignKeys(index)" :pushSelectedKeys="pushSelectedForeignKeys(index,currentLocalHotId)"/>
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
      // foreignHeaderNames: []
      // hotIdAllForeignKeys: [],
      allForeignKeys: {},
      // isHeadersSelected: false,
      // enableForeignTable: true,
      allTableNames: [],
      // enableForeignHeaders: true,
      // selectedForeignKeys: [],
      allTabTableNames: [],
      allTableNamesHeaderNames: {}
      // debounceUpdateForeignHeaderNames: _.debounce(this.updateForeignHeaderNames, 100, {
      //   'leading': false,
      //   'trailing': true
      // })
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
    // foreignHeaderNames() {
    //   return this.allTableNamesHeaderNames[this.]
    // }
    // getAllForeignHeaderNames() {
    //   console.log('getting foreign header names...')
    //
    //   //      console.log(foreignHeaderNames)
    //   // return foreignHeaderNames
    //   // _.forEach(this.allTableNames, function(tabTitle, tabId) {
    //   //   let hotId = this.getHotIdFromTabTitle(tabTitle)
    //   //   let foreignHeaderNames = this.getHotIdHeaderNames(this.allColumns, hotId)
    //   //   console.log('next set of foreign header names are:')
    //   //   console.log(foreignHeaderNames)
    //   // })
    //   //      console.log(`tab id found is ${tabId}`)
    //   // let hotId = this.getTabId(tabId)
    //   //      console.log(`hot id found is ${hotId}`)
    //   // return hotId
    // }
  },
  subscriptions() {
    return {
      allColumns: allTablesAllColumnNames$
      // isHeadersSelected: selectedForeignLocalHeaders$
    }
  },
  methods: {
    removeForeignKey: function(index) {
      let foreignKeys = this.getAllForeignKeysFromCurrentHotId
      foreignKeys.splice(index, 1)
      this.setProperty(this.propertyName, foreignKeys)
      //      console.log(this.hotIdAllForeignKeys)
      // this.$forceUpdate()
    },
    addForeignKey: function() {
      // this.getAllForeignKeysFromCurrentHotId[index]
      let foreignKeys = this.getAllForeignKeysFromCurrentHotId
      foreignKeys.push(this.emptyForeignKey)
      this.setProperty(this.propertyName, foreignKeys)
      // pushEmptyForeignKey$.next(this.currentLocalHotId)
      // this.pushEmptyForeignKey()
      // this.hotIdAllForeignKeys.push(this.emptyForeignKey)
      // this.setProperty(this.propertyName, this.hotIdAllForeignKeys)
      // //      console.log(this.hotIdAllForeignKeys)
      // this.$forceUpdate()
    },
    // getForeignHeaderNames: function(value) {
    //   // console.log('getting foreign header names...')
    //   // let hotId = this.getHotIdFromTabTitle(value)
    //   // let foreignHeaderNames = this.getHotIdHeaderNames(this.allColumns, hotId)
    //   // //      console.log(foreignHeaderNames)
    //   // return foreignHeaderNames
    // },
    getHotIdFromTabTitle: function(tableName) {
      let tabId = _.findKey(this.allTabTableNames, function(o) {
        return o === tableName
      })
      //      console.log(`tab id found is ${tabId}`)
      let hotId = this.getTabId(tabId)
      //      console.log(`hot id found is ${hotId}`)
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
        // this.allForeignKeys = this.getAllForeignKeys
        // this.hotIdAllForeignKeys.length = 0
        // let allForeignKeyValues = this.allForeignKeyValues(localHotId)
        // this.hotIdAllForeignKeys.push(...allForeignKeyValues)
        // console.log('foreign keys')
        // console.log(this.hotIdAllForeignKeys)
        // this.$forceUpdate()
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
    getSelectedKeys: function(index) {
      // let foreignKeys = this.allForeignKeys[this.currentLocalHotId]
      let foreignKey = this.getAllForeignKeysFromCurrentHotId[index]
      // let foreignKey = foreignKeys[index]
      console.log(`foreign key is`)
      console.log(foreignKey)
      console.log(`index is ${index}`)
      // let foreignKeys = this.getAllForeignKeys()[hotId]
      // let foreignKey = foreignKeys[index]
      let headers = foreignKey.fields || []
      console.log('fields are:')
      console.log(headers)
      // this.isHeadersSelected = headers.length > 0
      // console.log('show headers?')
      // console.log(this.isHeadersSelected)
      return headers
    },
    getSelectedForeignKeys: function(index) {
      // let foreignKeys = this.allForeignKeys[this.currentLocalHotId]
      let foreignKey = this.getAllForeignKeysFromCurrentHotId[index]
      console.log('foreign key is:')
      console.log(foreignKey)
      // let foreignKey = foreignKeys[index]
      // let foreignKeys = this.getAllForeignKeys()[hotId]
      // let foreignKey = foreignKeys[index]
      let headers = foreignKey.reference.fields || []
      console.log('foreign fields are:')
      console.log(headers)
      return headers
    },
    getSelectedTable: function(index) {
      // let foreignKeys = this.allForeignKeys[this.currentLocalHotId]
      let foreignKey = this.getAllForeignKeysFromCurrentHotId[index]
      // let foreignKey = foreignKeys[index]
      // let foreignKeys = this.getAllForeignKeys()[hotId]
      // let foreignKey = foreignKeys[index]
      let table = foreignKey.reference.resource
      if (!table) {
        table = this.allTableNames[0]
        this.pushSelectedForeignTable(index, this.currentLocalHotId)(table)
      }
      console.log('table is:')
      console.log(table)
      selectedForeignTable$.next(table)
      // this.updateForeignHeaderNames(table)

      // ensure no caching
      // this.foreignHeaderNames = this.allTableNamesHeaderNames[table]
      // console.log('updated foreign header names are now:')
      // console.log(this.foreignHeaderNames)
      return function() {
        return table
      }
    },
    updateIsSelectedHeaders: function(value) {
      // this.isHeadersSelected = !!value
      // console.log('updated from set')
      // console.log(this.isHeadersSelected)
      // if (!value) {
      //   this.pushSelectedForeignTable(index)('')
      // }
    },
    pushSelectedLocalKeys: function(index, hotId) {
      console.log(`hot id in push selected local keys is ${hotId}`)
      console.log('pushing selected local keys...')
      let vueSetProperty = this.pushForeignKeysLocalFieldsForTable
      // let vueIsSelectedHeaders = this.updateIsSelectedHeaders
      return function(headers) {
        selectedForeignLocalHeaders$.next(headers.length > 0)
        // this.isHeadersSelected =
        // console.log('is headers?')
        // console.log(this.isHeadersSelected)
        let object = { hotId: hotId, index: index, fields: headers }
        console.log('local object to set is')
        console.log(object)
        vueSetProperty(object)
        // vueIsSelectedHeaders(headers)
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
      // let vueSetProperty = this.setProperty
      // let vuePropertyName = this.propertyName
      // let vueUpdateForeignHeaderNames = this.updateForeignHeaderNames
      let vueSetProperty = this.pushForeignKeysForeignTableForTable
      return function(value) {
        // vueSetProperty(`${vuePropertyName}[${index}].reference.resource`, value)
        // selectedForeignTable$.next(value)
        let object = { hotId: hotId, index: index, resource: value }
        console.log('foreign table object to set is')
        console.log(object)
        vueSetProperty(object)
      }
    },
    pushSelectedForeignKeys: function(index, hotId) {
      console.log(`hot id in push selected foreign keys is ${hotId}`)
      let vueSetProperty = this.pushForeignKeysForeignFieldsForTable
      // let vueIsSelectedHeaders = this.updateIsSelectedHeaders
      return function(headers) {
        let object = { hotId: hotId, index: index, fields: headers }
        console.log('foreign keys object to set is')
        console.log(object)
        vueSetProperty(object)
        // vueIsSelectedHeaders(headers, index)
      }
    }
    // forceUpdateWrapper: function() {
    //   this.$forceUpdate()
    // }

  },
  created: function() {
    let vueUpdateTableSubscriptions = this.updateTableSubscriptions
    this.$subscribeTo(allTabsTitles$, async function(allTabsTitles) {
      //      console.log('received next tab subscription...')
      //      console.log(allTabsTitles)
      vueUpdateTableSubscriptions(allTabsTitles)
    })
    let vueUpdateForeignHeaderNames = this.updateForeignHeaderNames

    this.$subscribeTo(selectedForeignTable$.debounce(() => Observable.timer(100)), function(selectedForeignTable) {
      //      console.log('received next tab subscription...')
      //      console.log(allTabsTitles)
      // this.foreignHeaderNames = this.allTableNamesHeaderNames[table]
      vueUpdateForeignHeaderNames(selectedForeignTable)
    })
    // this.$subscribeTo(selectedForeignTable$, function(selectedForeignTable) {
    //   //      console.log('received next tab subscription...')
    //   //      console.log(allTabsTitles)
    //   // this.foreignHeaderNames = this.allTableNamesHeaderNames[table]
    //   vueUpdateForeignHeaderNames(selectedForeignTable)
    // })
  },
  watch: {
  },
  mounted: function() {
    //    console.log('firing mount...')
    pushAllTabTitlesSubscription()
  }
}
</script>
<style lang="styl" scoped>
@import '~static/css/foreignkeys'
</style>
