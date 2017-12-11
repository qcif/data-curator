<template>
<div id="foreignKeyFields">
  <div v-for="(foreignKey,index) in hotForeignKeys" class="foreign col-sm-12">
    <div class="inputs-container">
      <component is="tableheaderkeys" :activeNames="localHeaderNames" :getSelectedKeys="getSelectedKeys(index,currentLocalHotId)" :pushSelectedKeys="pushSelectedLocalKeys(index,currentLocalHotId)" />
      <!-- <component v-show="enableComponent(foreignKey.fields)" is="tablekeys" :allTableNames="allTableNames" :getSelectedTable="foreignKey.reference.resource" :pushSelectedTable="pushSelectedForeignTable(index)" />
      <component v-show="enableComponent(foreignKey.fields)" is="tableheaderkeys" :activeNames="getForeignHeaderNames(foreignKey.reference.resource)" :getSelectedKeys="foreignKey.reference.fields" :pushSelectedKeys="pushSelectedForeignKeys(index)"/> -->
    </div>
    <!-- <button v-show="hotIdAllForeignKeys.length > 1" type="button" class="btn btn-danger btn-sm" @click="removeForeignKey(index)">
      <span class="glyphicon glyphicon-minus"/>
    </button> -->
  </div>
  <!-- <div class="button-container">
    <button type="button" class="add-foreign btn btn-primary btn-sm" @click="addForeignKey()">
      <span class="glyphicon glyphicon-plus"/>Add Foreign Key
    </button>
  </div> -->
</div>
</template>
<script>
// import tablekeys from '../partials/TableKeys'
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
  // allTabsTitles$,
  // selectedForeignTable$,
  allTablesAllColumnNames$
} from '@/rxSubject.js'
import VueRx from 'vue-rx'
import Vue from 'vue'
Vue.use(VueRx, {
  Subscription
})
export default {
  components: {
    // tablekeys,
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
        let foreignKeys = this.getAllForeignKeys()[hotId]
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
      currentLocalHotId: '',
      // foreignHeaderNames: []
      hotIdAllForeignKeys: [],
      allForeignKeys: {}
      // enableForeignTable: true,
      // allTableNames: []
      // enableForeignHeaders: true,
      // selectedForeignKeys: [],
      // allTabTableNames: []
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
  // subscriptions() {
  //   return {
  //     allTablesAllColumnNames: allTablesAllColumnNames$
  //   }
  // },
  methods: {
    // removeForeignKey: function(index) {
    //   this.hotIdAllForeignKeys.splice(index, 1)
    //   this.setProperty(this.propertyName, this.hotIdAllForeignKeys)
    //   //      console.log(this.hotIdAllForeignKeys)
    //   this.$forceUpdate()
    // },
    // addForeignKey: function() {
    //   this.hotIdAllForeignKeys.push(this.emptyForeignKey)
    //   this.setProperty(this.propertyName, this.hotIdAllForeignKeys)
    //   //      console.log(this.hotIdAllForeignKeys)
    //   this.$forceUpdate()
    // },
    // allForeignKeyValues: function(localHotId) {
    //   //      console.log('before checking foreign key values...')
    //   //      console.log(localHotId)
    //   let foreignKeys = this.getPropertyGivenHotId(this.propertyName, localHotId)
    //   if (!foreignKeys) {
    //     //        console.log('have to reset foreign keys...')
    //     foreignKeys = [this.emptyForeignKey]
    //     this.setProperty(this.propertyName, foreignKeys)
    //   }
    //   //      console.log('now all foreign key values...')
    //   //      console.log(foreignKeys)
    //   return foreignKeys
    // },
    // getHotIdFromTabTitle: function(tableName) {
    //   let tabId = _.findKey(this.allTabTableNames, function(o) {
    //     return o === tableName
    //   })
    //   //      console.log(`tab id found is ${tabId}`)
    //   let hotId = this.getTabId(tabId)
    //   //      console.log(`hot id found is ${hotId}`)
    //   return hotId
    // },
    // getForeignHeaderNames: function(value) {
    //   let hotId = this.getHotIdFromTabTitle(value)
    //   let foreignHeaderNames = this.getHotIdHeaderNames(this.allTablesAllColumnNames, hotId)
    //   //      console.log(foreignHeaderNames)
    //   return foreignHeaderNames
    // },
    // updateForeignHeaderNames: function(value) {
    //   let hotId = this.getHotIdFromTabTitle(value)
    //   this.foreignHeaderNames.length = 0
    //   this.foreignHeaderNames.push(...this.getHotIdHeaderNames(this.allTablesAllColumnNames, hotId))
    // },
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
        this.$forceUpdate()
      } catch (err) {
        console.log('Problem with updating subscriptions', err)
      }
    },
    // getTabsTableNames: function(allTabsTableNames) {
    //   let tableNames = []
    //   _.forEach(allTabsTableNames, function(name, tabId) {
    //     tableNames.push(name)
    //   })
    //   return _.pull(tableNames, '', null, undefined)
    // },
    // updateTableSubscriptions: function(allTabsTitles) {
    //   //      console.log('received foreign tables subscription...')
    //   this.allTableNames = this.getTabsTableNames(allTabsTitles)
    //   this.allTabTableNames = allTabsTitles
    // },
    // enableComponent: function(value) {
    //   let hasValue = false
    //   if (value) {
    //     if (typeof value === 'string') {
    //       hasValue = value.trim() !== ''
    //     } else {
    //       hasValue = !_.isEmpty(value)
    //     }
    //   }
    //   return hasValue
    // },
    getSelectedKeys: function(index, hotId) {
      let foreignKeys = this.getAllForeignKeys()[hotId]
      let foreignKey = foreignKeys[index]
      let headers = foreignKey.fields
      console.log('fields are:')
      console.log(headers)
      // return function() {
      // console.log(`fields get are: ${fields}`)
      return headers
      // }
    },
    pushSelectedLocalKeys: function(index, hotId) {
      console.log('pushing selected local keys...')
      let vueSetProperty = this.pushForeignKeysLocalFieldsForTable
      return function(localHeaders) {
        let object = { hotId: hotId, index: index, fields: localHeaders }
        console.log('object to set is')
        console.log(object)
        vueSetProperty(object)
      }
    }
    // pushSelectedForeignKeys: function(index) {
    //   let vueSetProperty = this.setProperty
    //   let vuePropertyName = this.propertyName
    //   return function(values) {
    //     vueSetProperty(`${vuePropertyName}[${index}].reference.fields`, values)
    //   }
    // },
    // pushSelectedForeignTable: function(index) {
    //   let vueSetProperty = this.setProperty
    //   let vuePropertyName = this.propertyName
    //   return function(value) {
    //     vueSetProperty(`${vuePropertyName}[${index}].reference.resource`, value)
    //   }
    // }
  },
  created: function() {
    // let vueUpdateTableSubscriptions = this.updateTableSubscriptions
    // this.$subscribeTo(allTabsTitles$, async function(allTabsTitles) {
    //   //      console.log('received next tab subscription...')
    //   //      console.log(allTabsTitles)
    //   vueUpdateTableSubscriptions(allTabsTitles)
    // })
  },
  watch: {
    getActiveTab: async function() {
      //      console.log('got active tab in foreign relation keys')
    }
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
