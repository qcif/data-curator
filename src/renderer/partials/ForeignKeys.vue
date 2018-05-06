<template>
<div id="foreignKeyFields">
  <div v-for="(foreignKey,index) in hotForeignKeys"  class="foreign col-sm-12">
    <div class="inputs-container">
      <component :key="getLocalComponentKey(index)" is="tableheaderkeys" :activeNames="localHeaderNames" :getSelectedKeys="getSelectedLocalKeys(index)" :pushSelectedKeys="pushSelectedLocalKeys(index,currentLocalHotId)" labelName="Foreign key(s)" :tooltipId="'tooltip-foreignkey' + index" tooltipView="tooltipForeignkey" :index="index" />
      <component v-if="isHeadersSelected && !fkPackages[index]" :key="getTableComponentKey(index)" is="tablekeys" :allTableNames="allTableNames" :getSelectedTable="getSelectedTable(index)" :pushSelectedTable="pushSelectedForeignTable(index,currentLocalHotId)" labelName="Reference Table" :tooltipId="'tooltip-foreignkey-table' + index" tooltipView="tooltipForeignkeyTable" :index="index" />
      <component v-if="isHeadersSelected && !fkPackages[index]" :key="getForeignComponentKey(index)" is="tableheaderkeys" :activeNames="getCurrentForeignHeaders(index)" :getSelectedKeys="getSelectedForeignKeys(index)" :pushSelectedKeys="pushSelectedForeignKeys(index,currentLocalHotId)" labelName="Reference Column(s)" :tooltipId="'tooltip-foreignkey-tablekey' + index" tooltipView="tooltipForeignkeyTablekey" :index="index" :currentHotId="currentHotId"/>
    </div>
    <button type="button" class="btn btn-danger btn-sm" @click="removeForeignKey(index)">
      <span class="glyphicon glyphicon-minus"/>
    </button>
    <div id="fk-package" class="clearfix">
      <template v-if="isHeadersSelected && fkPackages[index]">
        <label class="control-label">Reference Package</label><span v-if="testLoadingPackage == index && loadingPackage[testLoadingPackage]" class="glyphicon glyphicon-refresh spinning"/>
        <div class="fk-package" :class="{ 'right': !fkPackages[index]}">
          <input :key="getForeignPackageKey(index)" class="form-control input-sm" type="text" :id="'fk-package' + index" :value="getFkPackage(index)" @input="setFkPackage(index, currentLocalHotId, $event.target.value)" :name="'fk-package' + index" @blur="removeFkPackageForErrors(index, currentLocalHotId)" />
        </div>
        <div v-if="fkPackages[index] && errors.has('fk-package' + index)" class="row help validate-danger">
          {{ errors.first('fk-package' + index)}}
        </div>
        <div v-if="fkPackages[index]">
          <component :key="getPackageTableComponentKey(index)" is="tablekeys" :allTableNames="allFkTableNames" :getSelectedTable="getFkPackageTable(index)" :pushSelectedTable="setFkPackageTable(index,currentLocalHotId)" labelName="Reference Table" :tooltipId="'tooltip-foreignkey-table' + index" tooltipView="tooltipForeignkeyTable" :index="index" />
          <component :key="getForeignPackageComponentKey(index)" is="tableheaderkeys" :activeNames="getCurrentPackageForeignHeaders(index)" :getSelectedKeys="getSelectedForeignKeys(index)" :pushSelectedKeys="pushSelectedForeignKeys(index,currentLocalHotId)" labelName="Reference Column(s)" :tooltipId="'tooltip-foreignkey-tablekey' + index" tooltipView="tooltipForeignkeyTablekey" :index="index" :currentHotId="currentHotId"/>
        </div>
      </template>
      <button type="button" class="add-foreign btn btn-primary btn-sm" @click="toggleFkPackage(index)">
        <span class="fas fa-exchange-alt"/>{{toggleText[index]}}
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
import {ipcRenderer as ipc} from 'electron'
import {Package} from 'datapackage'
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
  allTablesAllColumnNames$,
  fkPackagesButtonText$,
  loadingPackage$
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
        let dummy4 = this.fkPackages
      }
    },
    isHeadersSelected: {
      async get() {
        let isSelected = this.localHeaderNames.length > 0
        return !!isSelected
      },
      watch() {
        let dummy = this.allTableNames
        let dummy2 = this.allForeignKeys
      }
    }
  },
  data() {
    return {
      localHeaderNames: [],
      currentLocalHotId: '',
      allForeignKeys: {},
      allTableNames: [],
      allFkTableNames: [],
      allTabTableNames: [],
      allTableNamesHeaderNames: {},
      allFkTableNamesHeaderNames: {},
      fkPackages: [],
      loadingPackage: []
    }
  },
  computed: {
    ...mapGetters(['getFkPackageComponents'])
  },
  subscriptions() {
    return {
      allColumns: allTablesAllColumnNames$,
      toggleText: fkPackagesButtonText$,
      testLoadingPackage: loadingPackage$
    }
  },
  methods: {
    ...mapMutations([
      'pushForeignKeysForeignPackageForTable', 'removeForeignKeysForeignPackageForTable', 'resetForeignKeysForeignTableForTable', 'resetForeignKeysForeignFieldsForTable', 'pushFkPackageComponents'
    ]),
    updateFkType: function(foreignKeys) {
      this.fkPackages.length = 0
      for (const [index, foreignKey] of foreignKeys.entries()) {
        let reference = foreignKey && foreignKey.reference
        this.fkPackages[index] = !!(reference && reference.package && reference.package.trim().length > 0)
      }
      this.updateToggleText()
    },
    getFkPackageTableOrDefault: function(table, index) {
      if (_.isEmpty(this.allFkTableNames)) {
        this.populateFkPackageComponents(index)
      }
      if (_.indexOf(this.allFkTableNames, table) === -1) {
        table = this.allFkTableNames[0]
      }
      return table
    },
    toggleFkPackage: function(index) {
      this.updateFkPackageIndex(index, !this.fkPackages[index])
      this.removeForeignKeysForeignPackageForTable({ index: index, hotId: this.currentLocalHotId })
      this.resetForeignKeysForeignTableForTable({ index: index, hotId: this.currentLocalHotId })
      this.resetForeignKeysForeignFieldsForTable({ index: index, hotId: this.currentLocalHotId })
      this.allFkTableNames = []
      this.allFkTableNamesHeaderNames = {}
    },
    getFkPackage: function(index) {
      if (this.loadingPackage[index]) {
        return this.loadingPackage[index]
      }
      let foreignKeys = this.getAllForeignKeysFromCurrentHotId()
      let foreignKey = foreignKeys[index] || {}
      let reference = foreignKey.reference || {}
      if (typeof reference.package !== 'undefined') {
        return reference.package
      }
    },
    populateFkPackageComponents: function(index) {
      let foreignKeys = this.getAllForeignKeysFromCurrentHotId()
      let foreignKey = foreignKeys[index] || {}
      let reference = foreignKey.reference || {}
      let dataPackage
      if (typeof reference.package !== 'undefined') {
        dataPackage = reference.package
        if (_.isEmpty(this.allFkTableNamesHeaderNames)) {
          this.allFkTableNamesHeaderNames = this.getFkPackageComponents(dataPackage)
          this.allFkTableNames = _.keys(this.allFkTableNamesHeaderNames)
        }
      }
      return dataPackage
    },
    setFkPackage: async function(index, hotId, value) {
      this.loadingPackage[index] = value
      loadingPackage$.next(index)
      let self = this
      // set timeout on spinner
      _.delay(function() {
        self.loadingPackage.length = 0
        loadingPackage$.next(-1)
      }, 10000)
      let isValid = await this.validatePackageUrl(`fk-package${index}`, index, hotId, value)
      if (isValid) {
        ipc.send('loadPackageUrl', index, hotId, value)
      }
    },
    stopLoadingPackageFeedback: function(index) {
      this.loadingPackage[index] = false
      loadingPackage$.next(-1)
    },
    removeFkPackageForErrors: function(index, hotId) {
      if (this.errors.has('fk-package' + index)) {
        this.removeForeignKeysForeignPackageForTable({ index: index, hotId: hotId })
      }
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
    getCurrentPackageForeignHeaders: function(index) {
      let currentTable = this.getFkPackageTable(index)
      const currentTableName = currentTable()
      if (currentTableName) {
        return this.allFkTableNamesHeaderNames[currentTableName]
      }
    },
    getLocalComponentKey: function(index) {
      return `localHeader${index}`
    },
    getTableComponentKey: function(index) {
      return `foreignTable${index}`
    },
    getForeignComponentKey: function(index) {
      return `foreignHeader${index}`
    },
    getPackageTableComponentKey: function(index) {
      return `foreignPackageTable${index}`
    },
    getForeignPackageComponentKey: function(index) {
      return `foreignPackageHeader${index}`
    },
    getForeignPackageKey: function(index) {
      return `foreignPackage${index}`
    },
    removeForeignKey: function(index) {
      _.unset(this.fkPackages, index)
      this.updateToggleText()
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
      this.updateToggleText()
      this.initTableHeaderKeys()
    },
    updateSubscriptions: async function(allTablesAllColumnNames, hotId) {
      try {
        let localHotId = await this.currentHotId()
        this.localHeaderNames.length = 0
        let headerNames = this.getHotIdHeaderNames(allTablesAllColumnNames, localHotId)
        this.localHeaderNames.push(...headerNames)
        this.$forceUpdate()
      } catch (err) {
        console.log(`There was a problem updating subscriptions.`, err)
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
    getFkPackageTable: function(index) {
      let foreignKeys = this.getAllForeignKeysFromCurrentHotId()
      let foreignKey = foreignKeys[index] || {}
      let reference = foreignKey.reference || {}
      const table = this.getFkPackageTableOrDefault(reference.resource, index)
      return function() {
        return table
      }
    },
    getSelectedTable: function(index) {
      let foreignKeys = this.getAllForeignKeysFromCurrentHotId()
      let foreignKey = foreignKeys[index] || {}
      let reference = foreignKey.reference || {}
      let table = reference.resource || this.getCurrentTitle()
      if (_.indexOf(this.allTableNames, table) === -1) {
        this.resetForeignKeysForeignTableForTable({ hotId: this.currentLocalHotId, index: index })
        table = this.getCurrentTitle()
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
    setFkPackageTable: function(index, hotId, table) {
      let vueSetProperty = this.pushForeignKeysForeignTableForTable
      return function(table) {
        let object = { hotId: hotId, index: index, resource: table }
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
      return async function(headers) {
        const activeHotId = await this.currentHotId()
        // switching tab may misalign setter trigger - ensure active tab has not changed
        if (activeHotId === hotId) {
          let object = { hotId: hotId, index: index, fields: headers }
          vueSetProperty(object)
        }
      }
    },
    getCurrentTitle: function() {
      return this.tabTitle(this.getActiveTab)
    },
    validatePackageUrl: async function(field, index, hotId, value) {
      // keep url:true as string for validation to work correctly
      try {
        let hasValidUrl = await this.validate(field, value, 'url:true')
        if (!hasValidUrl) {
          this.$validator.errors.add({field: field, msg: 'The package field must be a valid url.'})
          return false
        }
        return true
      } catch (err) {
        console.log('Problem with validation', err)
        return false
      }
    },
    updateFkPackageIndex: function(index, hasPackage) {
      this.fkPackages[index] = !!hasPackage
      this.updateToggleText()
    },
    updateToggleText: function() {
      const toggleText = []
      for (const [index, value] of this.fkPackages.entries()) {
        toggleText[index] = value ? 'Switch to FK Local Table' : 'Switch to FK Package URL'
      }
      fkPackagesButtonText$.next(toggleText)
    },
    updateFkComponents: async function(dataPackage, url) {
      this.allFkTableNames.length = 0
      this.allFkTableNamesHeaderNames = {}
      for (const resource of dataPackage.resources) {
        this.allFkTableNames.push(resource.name)
        this.allFkTableNamesHeaderNames[resource.name] = resource.schema.fieldNames
        this.pushFkPackageComponents({
          url: url,
          tableName: resource.name,
          fields: resource.schema.fieldNames
        })
      }
    }
  },
  created: async function() {
    let self = this
    this.$subscribeTo(allTabsTitles$, function(allTabsTitles) {
      self.updateTableSubscriptions(allTabsTitles)
    })
    // occasionally fkpackage table getter doesn't arrive on tab change - update to ensure all received
    _.delay(function() {
      self.$forceUpdate()
    }, 200)
    ipc.on('packageUrlLoaded', async function(event, index, hotId, url, descriptor) {
      const dataPackage = await Package.load(descriptor)
      if (dataPackage && dataPackage.valid) {
        self.stopLoadingPackageFeedback()
        self.updateFkPackageIndex(index, true)
        self.pushForeignKeysForeignPackageForTable({ hotId: hotId, index: index, package: url })
        await self.updateFkComponents(dataPackage, url)
      }
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
