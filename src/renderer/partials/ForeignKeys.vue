<template>
  <div id="foreignKeyFields">
    <component v-show="enableLocalHeaders" is="tableheaderkeys" :activeNames="localHeaderNames" :getSelectedKeys="getSelectedLocalKeys" :pushSelectedKeys="pushSelectedLocalKeys"/>
    <component v-show="enableForeignTable" is="tablekeys" :allTableNames="allTableNames" :pushSelectedTable="pushSelectedForeignTable"/>
    <!-- <component v-show="enableForeignHeaders" is="tableheaderkeys" :activeNames="activeForeignNames" :selectedKeys="selectedForeignKeys"/>  -->
  </div>
</template>
<script>
import tablekeys from '../partials/TableKeys'
import tableheaderkeys from '../partials/TableHeaderKeys'
import RelationKeys from '../mixins/RelationKeys'
import {pushAllTabTitlesSubscription} from '@/store/modules/tabs.js'
import {
  mapMutations,
  mapGetters
} from 'vuex'
import { Subscription } from 'rxjs/Subscription'
import {allTabsTitles$, selectedForeignTable$} from '@/rxSubject.js'
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
      selectedLocalKeys: [],
      enableForeignTable: true,
      allTableNames: [],
      enableForeignHeaders: true,
      selectedForeignKeys: [],
      debounceUpdateTableSelections: _.debounce(this.updateTableSelections, 100, {
        'leading': false,
        'trailing': true
      })
    }
  },
  computed: {
    localName() {
      return `${this.propertyName}.fields`
    },
    tableName() {
      return `${this.propertyName}.reference`
    },
    getSelectedLocalKeys() {
      return this.selectedLocalKeys || []
    }
  },
  methods: {
    allForeignKeyValues(localHotId) {
      console.log('before checking foreign key values...')
      console.log(localHotId)
      let foreignKeys = this.getPropertyGivenHotId(this.propertyName, localHotId) || {fields: [], reference: ''}
      console.log(foreignKeys)
      return foreignKeys
    },
    updateSubscriptions: async function(allTablesAllColumns) {
      let localHotId = await this.currentHotId()
      console.log('received local headers subscription...')
      this.localHeaderNames.length = 0
      this.localHeaderNames.push(...this.getHotIdHeaderNames(allTablesAllColumns, localHotId))
      this.selectedLocalKeys.length = 0
      let foreignKeyFieldValues = this.allForeignKeyValues(localHotId).fields || []
      this.selectedLocalKeys.push(...foreignKeyFieldValues)
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
    },
    updateTableSelections: async function() {
      let localHotId = await this.currentHotId()
      let foreignKeyTableValue = this.allForeignKeyValues(localHotId).reference
      console.log('selected table is:')
      console.log(foreignKeyTableValue)
      // if no value exists set first value TODO: ensure also remove once disappear foreign table view
      if (!foreignKeyTableValue && this.allTableNames.length > 0) {
        foreignKeyTableValue = this.allTableNames[0]
        this.pushSelectedForeignTable(foreignKeyTableValue)
      }
      selectedForeignTable$.next(foreignKeyTableValue)
    },
    pushSelectedLocalKeys: function(values) {
      console.log(`property name before foreign key push is ${this.localName}`)
      console.log(values)
      this.setProperty(this.localName, values)
    },
    pushSelectedForeignTable: function(value) {
      console.log(`property name before foreign key table push is ${this.tableName}`)
      console.log(value)
      this.setProperty(this.tableName, value)
    }
  },
  created: function() {
    let vueUpdateTableSubscriptions = this.updateTableSubscriptions
    let vueUpdateTableSelections = this.debounceUpdateTableSelections
    // TODO: need to manage subscription here...
    this.$subscribeTo(allTabsTitles$, async function(allTabsTitles) {
      console.log('received next tab subscription...')
      console.log(allTabsTitles)
      vueUpdateTableSubscriptions(allTabsTitles)
      await vueUpdateTableSelections()
    })
  },
  watch: {
    getActiveTab: async function() {
      console.log('got active tab in foreign relation keys')
      await this.debounceUpdateTableSelections()
    }
  },
  mounted: function() {
    console.log('firing mount...')
    pushAllTabTitlesSubscription()
  }
}
</script>
<style lang="styl" scoped>
@import '~static/css/foreignkeys'
</style>
