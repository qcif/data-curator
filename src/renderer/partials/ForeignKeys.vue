<template>
<div id="foreignKeyFields">
  <template v-for="(foreignKey,index) in hotIdAllForeignKeys" >
    <component v-show="enableLocalHeaders" is="tableheaderkeys" :activeNames="localHeaderNames" :getSelectedKeys="foreignKey.fields" :pushSelectedKeys="pushSelectedLocalKeys(index)" />
    <component v-show="enableForeignTable" is="tablekeys" :allTableNames="allTableNames" :pushSelectedTable="pushSelectedForeignTable(index)" />
    <!-- <component v-show="enableForeignHeaders" is="tableheaderkeys" :activeNames="activeForeignNames" :selectedKeys="selectedForeignKeys"/>  -->
    <button v-show="hotIdAllForeignKeys.length > 1" type="button" class="btn btn-danger btn-sm" @click="removeForeignKey(index)">
      <span class="glyphicon glyphicon-minus"/>
    </button>
  </template>
  <div class="button-container">
    <button type="button" class="add-source btn btn-primary btn-sm" @click="addForeignKey()">
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
  selectedForeignTable$
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
      // selectedLocalKeys: [[]],
      hotIdAllForeignKeys: [],
      enableForeignTable: true,
      allTableNames: [],
      enableForeignHeaders: true,
      selectedForeignKeys: []
      // debounceUpdateTableSelections: _.debounce(this.updateTableSelections, 100, {
      //   'leading': false,
      //   'trailing': true
      // })
    }
  },
  computed: {
    // localName() {
    //   return `${this.propertyName}.fields`
    // },
    // tableName() {
    //   return `${this.propertyName}.reference`
    // }
    // getSelectedLocalKeys() {
    //
    // }
  },
  methods: {
    // getSelectedLocalKeys: (index) => () => {
    //   let foreignKey = this.hotIdAllForeignKeys[index] || {}
    //   return foreignKey.fields || []
    // },
    // getSelectedLocalKeysFn: function(index) {
    //   let foreignKey = this.hotIdAllForeignKeys[index] || {}
    //   return foreignKey.fields || []
    // },
    addForeignKey: function() {
    },
    removeForeignKey: function(index) {
    },
    allForeignKeyValuesByIndex: (localHotId) => (index) => {
      return this.allForeignKeyValues(localHotId)[index]
    },
    allForeignKeyValues: function(localHotId) {
      console.log('before checking foreign key values...')
      console.log(localHotId)
      let foreignKeys = this.getPropertyGivenHotId(this.propertyName, localHotId)
      if (!foreignKeys) {
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
      console.log(foreignKeys[0])
      console.log(foreignKeys[0].reference)
      return foreignKeys
    },
    updateSubscriptions: async function(allTablesAllColumns) {
      try {
        let localHotId = await this.currentHotId()
        console.log('received local headers subscription...')
        this.localHeaderNames.length = 0
        this.localHeaderNames.push(...this.getHotIdHeaderNames(allTablesAllColumns, localHotId))
        this.hotIdAllForeignKeys.length = 0
        let allForeignKeyValues = this.allForeignKeyValues(localHotId)
        console.log('have all foreign key values')
        console.log(allForeignKeyValues)
        console.log(allForeignKeyValues[0])
        console.log(allForeignKeyValues[0].reference)
        console.log(this.hotIdAllForeignKeys)
        this.hotIdAllForeignKeys.push(...allForeignKeyValues)
        console.log('this hot id all foreign keys...')
        console.log(this.hotIdAllForeignKeys)
        console.log(this.hotIdAllForeignKeys[0])
      } catch (err) {
        console.log('Problem with updating subscriptions', err)
      }
      // console.log(this.hotIdAllForeignKeys[0].reference.fields)
      // this.selectedLocalKeys.push(...foreignKeyFieldValues)
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
    // updateTableSelections: async function() {
    //   let localHotId = await this.currentHotId()
    //   let foreignKeyTableValue = this.allForeignKeyValues(localHotId)
    //   // console.log('selected table is:')
    //   // console.log(foreignKeyTableValue)
    //   // if no value exists set first value TODO: ensure also remove once disappear foreign table view
    //   if (this.allTableNames.length > 0) {
    //     foreignKeyTableValue = this.allTableNames[0]
    //     this.pushSelectedForeignTable(foreignKeyTableValue)
    //   }
    //   selectedForeignTable$.next(foreignKeyTableValue)
    // },
    // TODO: add more specific push method for foreign keys rather than clobbering all
    getHotIdAllForeignKeys: function() {
      return this.hotIdAllForeignKeys
    },
    pushSelectedLocalKeys: function(index) {
      console.log(`index is ${index}`)
      let vueHotIdAllForeignKeysFn = this.getHotIdAllForeignKeys
      let vueSetProperty = this.setProperty
      let vuePropertyName = this.propertyName
      return function(values) {
        console.log(`index is ${index}`)
        let vueHotIdAllForeignKeys = vueHotIdAllForeignKeysFn()
        console.log('now have all foreign keys')
        console.log(vueHotIdAllForeignKeys)
        if (!vueHotIdAllForeignKeys[index].fields) {
          vueHotIdAllForeignKeys[index].fields = values
        } else {
          vueHotIdAllForeignKeys[index].fields.length = 0
          vueHotIdAllForeignKeys[index].fields.push(...values)
        }
        vueSetProperty(vuePropertyName, vueHotIdAllForeignKeys)
      }
    },
    // TODO: add more specific push method for foreign keys rather than clobbering all
    pushSelectedForeignTable: function(index) {
      let vueHotIdAllForeignKeys = this.hotIdAllForeignKeys
      let vueSetProperty = this.setProperty
      let vuePropertyName = this.propertyName
      return function(value) {
        vueHotIdAllForeignKeys[index].reference.resource = value
        console.log(value)
        vueSetProperty(vuePropertyName, vueHotIdAllForeignKeys)
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
  // watch: {
  //   getActiveTab: async function() {
  //     console.log('got active tab in foreign relation keys')
  //     await this.debounceUpdateTableSelections()
  //   }
  // },
  mounted: function() {
    console.log('firing mount...')
    pushAllTabTitlesSubscription()
  }
}
</script>
<style lang="styl" scoped>
@import '~static/css/foreignkeys'
</style>
