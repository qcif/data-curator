<template>
<div id="foreignKeyFields">
  <div v-for="(foreignKey,index) in hotForeignKeys"  class="foreign col-sm-12">
    <div class="inputs-container">
      <component :key="getLocalComponentKey(index)" is="tableheaderkeys" :activeNames="localHeaderNames" :getSelectedKeys="getSelectedLocalKeys(index)" :pushSelectedKeys="pushSelectedLocalKeys(index,currentLocalHotId)" labelName="Foreign key(s)" :tooltipId="'tooltip-foreignkey' + index" tooltipView="tooltipForeignkey" :index="index" />
      <component v-if="isHeadersSelected && fkPackages[index] === false" :key="getTableComponentKey(index)" is="tablekeys" :allTableNames="allTableNames" :getSelectedTable="getSelectedTable(index)" :pushSelectedTable="pushSelectedForeignTable(index,currentLocalHotId)" labelName="Reference Table" :tooltipId="'tooltip-foreignkey-table' + index" tooltipView="tooltipForeignkeyTable" :index="index" />
      <component v-if="isHeadersSelected && fkPackages[index] === false" :key="getForeignComponentKey(index)" is="tableheaderkeys" :activeNames="getCurrentForeignHeaders(index)" :getSelectedKeys="getSelectedForeignKeys(index)" :pushSelectedKeys="pushSelectedForeignKeys(index,currentLocalHotId)" labelName="Reference Column(s)" :tooltipId="'tooltip-foreignkey-tablekey' + index" tooltipView="tooltipForeignkeyTablekey" :index="index"/>
    </div>
    <button type="button" class="btn btn-danger btn-sm" @click="removeForeignKey(index)">
      <span class="glyphicon glyphicon-minus"/>
    </button>
    <div id="fk-package" class="clearfix">
      <label v-if="fkPackages[index] === true" class="control-label">Reference Package</label>
      <div class="fk-package" :class="{ 'right': !fkPackages[index]}">
        <input v-if="fkPackages[index] === true" class="form-control input-sm" type="text" :id="'fk-package' + index" :value="getFkPackage(index)" @input="setFkPackage(index, currentLocalHotId, $event.target.value)" :name="'fk-package' + index"/>
      </div>
      <div v-if="fkPackages[index] === true && errors.has('fk-package' + index)" class="row help validate-danger">
        {{ errors.first('fk-package' + index)}}
      </div>
      <div v-if="fkPackages[index] === true">
        <label class="control-label">Reference Table</label>
        <input class="form-control input-sm" type="text" id="fk-package-table" name="fk-package-table" :value="getFkPackageTable(index)" @input="setFkPackageTable(index, currentLocalHotId, $event.target.value)" />
        <label class="control-label">Reference Column(s)</label>
        <input class="form-control input-sm" type="text" id="fk-package-columns" name="fk-package-columns" :value="getFkPackageColumns(index)" @input="setFkPackageColumns(index, currentLocalHotId, $event.target.value)" />
      </div>
      <button type="button" class="add-foreign btn btn-primary btn-sm" @click="toggleFkPackage(index)">
        <span class="fas fa-exchange-alt"/>{{fkButtonMessage(index)}}
      </button>
    </div>
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
import ValidationRules from '../mixins/ValidationRules'
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
  mixins: [RelationKeys, ValidationRules],
  name: 'foreignkeys',
  props: ['setProperty', 'getPropertyGivenHotId', 'propertyName', 'currentHotId'],
  asyncComputed: {
    hotForeignKeys: {
      async get() {
        let hotId = await this.currentHotId()
        this.currentLocalHotId = hotId
        this.allForeignKeys = this.getAllForeignKeys()
        let foreignKeys = this.allForeignKeys[hotId]
        this.updateFkType(foreignKeys)
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
      currentLocalHotId: '',
      allForeignKeys: {},
      allTableNames: [],
      allTabTableNames: [],
      allTableNamesHeaderNames: {},
      fkPackages: []
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
    ...mapMutations([
      'pushForeignKeysForeignPackageForTable', 'removeForeignKeysForeignPackageForTable'
    ]),
    updateFkType: function(foreignKeys) {
      for (const [index, foreignKey] of foreignKeys.entries()) {
        let reference = foreignKey && foreignKey.reference
        this.fkPackages[index] = !!(reference && reference.package && reference.package.trim().length > 0)
      }
    },
    fkButtonMessage(index) {
      return this.fkPackages[index] ? 'Switch to FK Local Table' : 'Switch to FK Package URL'
    },
    getFkPackageColumns: function(index) {
      let columnArray = this.getSelectedForeignKeys(index)
      return _.join(columnArray)
    },
    setFkPackageColumns: function(index, hotId, value) {
      let columnArray = _.split(value, ',')
      this.pushForeignKeysForeignFieldsForTable({ hotId: hotId, index: index, fields: columnArray })
    },
    getFkPackageTable: function(index) {
      let foreignKeys = this.getAllForeignKeysFromCurrentHotId()
      let foreignKey = foreignKeys[index] || {}
      console.log(foreignKey.reference)
      let reference = foreignKey.reference || {}
      let table = reference.resource
      return table
    },
    setFkPackageTable: function(index, hotId, value) {
      this.pushForeignKeysForeignTableForTable({ hotId: hotId, index: index, resource: value })
    },
    toggleFkPackage: function(index) {
      this.fkPackages[index] = !this.fkPackages[index]
      this.$forceUpdate()
    },
    getFkPackage: function(index) {
      let foreignKeys = this.getAllForeignKeysFromCurrentHotId()
      let foreignKey = foreignKeys[index] || {}
      let reference = foreignKey.reference || {}
      return reference.package
    },
    setFkPackage: function(index, hotId, value) {
      this.validatePackageUrl({field: `fk-package${index}`, value: value, rules: 'url:true', index: index})
      this.pushForeignKeysForeignPackageForTable({ hotId: hotId, index: index, package: value })
    },
    removeFkPackage: function(index, hotId) {
      this.removeForeignKeysForeignPackageForTable({ hotId: hotId, index: index })
    },
    getAllForeignKeysFromCurrentHotId: function() {
      let currentHotId = this.currentLocalHotId
      let allForeignKeys = this.getAllForeignKeys()
      let foreignKeys = allForeignKeys[currentHotId]
      return foreignKeys
    },
    getCurrentForeignHeaders: function(index) {
      let currentTable = this.getSelectedTable(index)
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
      _.unset(this.fkPackages, index)
      let foreignKeys = this.getAllForeignKeysFromCurrentHotId()
      foreignKeys.splice(index, 1)
      this.setProperty(this.propertyName, foreignKeys)
    },
    addForeignKey: function() {
      let foreignKeys = this.getAllForeignKeysFromCurrentHotId()
      foreignKeys.push({
        fields: [],
        reference: {
          resource: '',
          fields: []
        }
      })
      this.setProperty(this.propertyName, foreignKeys)
      this.fkPackages[this.fkPackages.length] = false
      this.initTableHeaderKeys()
    },
    updateSubscriptions: async function(allTablesAllColumnNames) {
      try {
        let localHotId = await this.currentHotId()
        this.localHeaderNames.length = 0
        let headerNames = this.getHotIdHeaderNames(allTablesAllColumnNames, localHotId)
        this.localHeaderNames.push(...headerNames)
      } catch (err) {
      }
    },
    updateTableSubscriptions: function(allTabsTitles) {
      this.allTableNames = this.getTabsTableNames(allTabsTitles)
      this.allTabTableNames = allTabsTitles
      let vueGetHotIdFromTabTitle = this.getHotIdFromTabTitle
      let vueGetHotIdHeaderNames = this.getHotIdHeaderNames
      let vueAllColumns = this.allColumns
      let allTableNamesHeaderNames = {}
      _.forEach(this.allTableNames, function(tabTitle) {
        let hotId = vueGetHotIdFromTabTitle(tabTitle)
        let foreignHeaderNames = vueGetHotIdHeaderNames(vueAllColumns, hotId)
        allTableNamesHeaderNames[tabTitle] = foreignHeaderNames
      })
      this.allTableNamesHeaderNames = _.assign({}, allTableNamesHeaderNames)
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
      let hotId = this.getSyncHotIdFromTabId(tabId)
      return hotId
    },
    getSelectedLocalKeys: function(index) {
      let foreignKeys = this.getAllForeignKeysFromCurrentHotId()
      let foreignKey = foreignKeys[index] || {}
      let headers = foreignKey.fields || []
      return headers
    },
    getSelectedTable: function(index) {
      let foreignKeys = this.getAllForeignKeysFromCurrentHotId()
      let foreignKey = foreignKeys[index] || {}
      let reference = foreignKey.reference || {}
      let table = reference.resource || this.getCurrentTitle()
      if (_.indexOf(this.allTableNames, table) === -1) {
        table = this.allTableNames[0]
      }
      return function() {
        return table
      }
    },
    getSelectedForeignKeys: function(index) {
      let foreignKeys = this.getAllForeignKeysFromCurrentHotId()
      let foreignKey = foreignKeys[index] || {}
      let reference = foreignKey.reference || {}
      let headers = reference.fields || []
      return headers
    },
    pushSelectedLocalKeys: function(index, hotId) {
      let vueSetProperty = this.pushForeignKeysLocalFieldsForTable
      return function(headers) {
        let object = { hotId: hotId, index: index, fields: headers }
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
        vueSetProperty(object)
      }
    },
    pushSelectedForeignKeys: function(index, hotId) {
      let vueSetProperty = this.pushForeignKeysForeignFieldsForTable
      return function(headers) {
        let object = { hotId: hotId, index: index, fields: headers }
        vueSetProperty(object)
      }
    },
    getCurrentTitle: function() {
      return this.tabTitle(this.getActiveTab)
    },
    validatePackageUrl: async function(field, value) {
      // keep url:true as string for validation to work correctly
      try {
        let hasValidUrl = await this.validate(field, value, 'url:true')
        if (!hasValidUrl) {
          this.$validator.errors.add({field: field, msg: 'The package field must be a valid url.'})
          this.removeFkPackage(field)
        }
      } catch (err) {
        console.log('Problem with validation', err)
      }
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
<style lang="styl" scoped>
@import '~static/css/validationrules'
</style>
