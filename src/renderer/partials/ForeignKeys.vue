<template>
<div id="foreignKeyFields">
  <div v-for="(foreignKey,index) in hotIdAllForeignKeys" class="foreign col-sm-12">
    <div class="inputs-container">
      <component v-show="enableLocalHeaders" is="tableheaderkeys" :activeNames="localHeaderNames" :getSelectedKeys="foreignKey.fields" :pushSelectedKeys="pushSelectedLocalKeys(index)" />
      <component v-show="enableForeignTable" is="tablekeys" :allTableNames="allTableNames" :getSelectedTable="getSelectedTable(foreignKey.reference.resource)" :pushSelectedTable="pushSelectedForeignTable(index)" />
      <component v-show="enableForeignHeaders" is="tableheaderkeys" :activeNames="getForeignHeaderNames(foreignKey.reference.resource)" :getSelectedKeys="foreignKey.reference.fields" :pushSelectedKeys="pushSelectedForeignKeys(index)"/>
    </div>
    <button v-show="hotIdAllForeignKeys.length > 1" type="button" class="btn btn-danger btn-sm" @click="removeForeignKey(index)">
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
  allTabsTitles$,
  selectedForeignTable$,
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
  data() {
    return {
      enableLocalHeaders: true,
      localHeaderNames: [],
      foreignHeaderNames: [],
      // selectedLocalKeys: [[]],
      hotIdAllForeignKeys: [],
      enableForeignTable: true,
      allTableNames: [],
      enableForeignHeaders: true,
      selectedForeignKeys: [],
      allTabTableNames: []
      // debounceUpdateTableSelections: _.debounce(this.updateTableSelections, 100, {
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
    }
  },
  subscriptions() {
    return {
      allTablesAllColumnNames: allTablesAllColumnNames$
    }
  },
  methods: {
    getSelectedTable: function(returnValue) {
      console.log('got return value...')
      console.log(returnValue)
      // selectedForeignTable$.next(returnValue)
      // this.updateForeignHeaderNames(returnValue)
      return returnValue
    },
    addForeignKey: function() {
      this.hotIdAllForeignKeys.push(this.emptyForeignKey)
      this.setProperty(this.propertyName, this.hotIdAllForeignKeys)
      console.log(this.hotIdAllForeignKeys)
      this.$forceUpdate()
    },
    removeForeignKey: function(index) {
    },
    allForeignKeyValues: function(localHotId) {
      console.log('before checking foreign key values...')
      console.log(localHotId)
      let foreignKeys = this.getPropertyGivenHotId(this.propertyName, localHotId)
      if (!foreignKeys) {
        console.log('have to reset foreign keys...')
        foreignKeys = [{
          fields: [],
          reference: {
            resource: '',
            fields: []
          }
        }]
        this.setProperty(this.propertyName, foreignKeys)
      }
      console.log('now all foreign key values...')
      console.log(foreignKeys)
      // console.log(foreignKeys[0])
      // console.log(foreignKeys[0].reference)
      return foreignKeys
    },
    getHotIdFromTabTitle: function(tableName) {
      console.log(`table name is ${tableName}`)
      // let allTabTableNames = this.allTabTableNames
      let tabId = _.findKey(this.allTabTableNames, function(o) {
        return o === tableName
      })
      console.log(`tab id found is ${tabId}`)
      let hotId = this.getTabId(tabId)
      console.log(`hot id found is ${hotId}`)
      // console.log(allTabTableNames)
      return hotId
    },
    getForeignHeaderNames: function(value) {
      let hotId = this.getHotIdFromTabTitle(value)
      let foreignHeaderNames = this.getHotIdHeaderNames(this.allTablesAllColumnNames, hotId)
      console.log(foreignHeaderNames)
      return foreignHeaderNames
    },
    updateForeignHeaderNames: function(value) {
      let hotId = this.getHotIdFromTabTitle(value)
      this.foreignHeaderNames.length = 0
      this.foreignHeaderNames.push(...this.getHotIdHeaderNames(this.allTablesAllColumnNames, hotId))
    },
    updateSubscriptions: async function(allTablesAllColumnNames) {
      console.log('updated subscriptions in foreign keys...')
      try {
        let localHotId = await this.currentHotId()
        this.localHeaderNames.length = 0
        this.localHeaderNames.push(...this.getHotIdHeaderNames(allTablesAllColumnNames, localHotId))
        this.hotIdAllForeignKeys.length = 0
        let allForeignKeyValues = this.allForeignKeyValues(localHotId)
        this.hotIdAllForeignKeys.push(...allForeignKeyValues)
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
      console.log('received foreign tables subscription...')
      this.allTableNames = this.getTabsTableNames(allTabsTitles)
      this.allTabTableNames = allTabsTitles
    },
    pushSelectedLocalKeys: function(index) {
      let vueSetProperty = this.setProperty
      let vuePropertyName = this.propertyName
      return function(values) {
        vueSetProperty(`${vuePropertyName}[${index}].fields`, values)
      }
    },
    pushSelectedForeignKeys: function(index) {
      let vueSetProperty = this.setProperty
      let vuePropertyName = this.propertyName
      return function(values) {
        vueSetProperty(`${vuePropertyName}[${index}].reference.fields`, values)
      }
    },
    // TODO: add more specific push method for foreign keys rather than clobbering all
    pushSelectedForeignTable: function(index) {
      let vueSetProperty = this.setProperty
      let vuePropertyName = this.propertyName
      // let vueUpdateForeignHeaderNames = this.updateForeignHeaderNames
      return function(value) {
        // vueUpdateForeignHeaderNames(value)
        vueSetProperty(`${vuePropertyName}[${index}].reference.resource`, value)
      }
    }
  },
  created: function() {
    let vueUpdateTableSubscriptions = this.updateTableSubscriptions
    // let vueUpdateTableSelections = this.debounceUpdateTableSelections
    // TODO: need to manage subscription here...
    this.$subscribeTo(allTabsTitles$, async function(allTabsTitles) {
      console.log('received next tab subscription...')
      console.log(allTabsTitles)
      vueUpdateTableSubscriptions(allTabsTitles)
      // await vueUpdateTableSelections()
    })
  },
  watch: {
    getActiveTab: async function() {
      console.log('got active tab in foreign relation keys')
      // await this.debounceUpdateTableSelections()
    }
  },
  mounted: function() {
    console.log('firing mount...')
    pushAllTabTitlesSubscription()
    // let vueSelectedForeignTable = this.updateSelectedForeignTable
    // let vueUpdateForeignHeaderNames = this.updateForeignHeaderNames
    // this.$subscribeTo(selectedForeignTable$, function(selectedForeignTable) {
    //   console.log('received subscription to selected foreign table...')
    //   console.log(selectedForeignTable)
    //   vueUpdateForeignHeaderNames(selectedForeignTable)
    //   // vueSelectedForeignTable(selectedForeignTable)
    // })
  }
}
</script>
<style lang="styl" scoped>
@import '~static/css/foreignkeys'
</style>
