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
        console.log(`getting hot foreign keys...`)
        let hotId = await this.currentHotId()
        this.currentLocalHotId = hotId
        this.allForeignKeys = this.getAllForeignKeys()
        let foreignKeys = this.allForeignKeys[hotId]
        // console.log('updating fk type..')
        this.updateFkType(foreignKeys)
        return foreignKeys
      },
      watch() {
        console.log('watching...')
        let dummy = this.localHeaderNames
        let dummy2 = this.getActiveTab
        // let dummy3 = this.isFkPackageVisible
        let dummy4 = this.fkPackages
        // let dummy4 = this.pushForeignKeysForeignPackageForTable
      }
    },
    isHeadersSelected: {
      async get() {
        let isSelected = this.localHeaderNames.length > 0
        // console.log(`is headers selected: ${isSelected}`)
        return !!isSelected
      },
      watch() {
        let dummy = this.allTableNames
        let dummy2 = this.allForeignKeys
      }
    },
    startLoadingPackageFeedbackCheck: {
      async get() {
        // let self = this
        console.log('initial async')
        return this.loadingPackage
      },
      watch() {
        let dummy = this.loadingPackage
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
      // toggleText: []
      // isFkPackageVisible: false
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
    // checkLoadingPackage: function(index) {
    //   console.log('checking loading package')
    //   console.log(this.loadingPackage)
    //   return this.loadingPackage[index]
    // },
    updateFkType: function(foreignKeys) {
      console.log('entered update fk type...')
      // console.log('all fk table names is:')
      // console.log(this.allFkTableNames)
      // console.log(this.allFkTableNamesHeaderNames)
      // ensure each tab keeps track of only its own fkPackages
      this.fkPackages.length = 0
      for (const [index, foreignKey] of foreignKeys.entries()) {
        let reference = foreignKey && foreignKey.reference
        // console.log(`reference is`)
        // console.log(reference)
        this.fkPackages[index] = !!(reference && reference.package && reference.package.trim().length > 0)
        // this.updateToggleTextIndex(index)
      }
      this.updateToggleText()
    },
    // fkButtonMessage: function(index) {
    //   // console.log('in button message, fk package index...')
    //   // console.log(this.fkPackages[index])
    //   return this.fkPackages[index] ? 'Switch to FK Local Table' : 'Switch to FK Package URL'
    // },
    getFkPackageTableOrDefault: function(table, index) {
      console.log('...getting fk package table or default...')
      if (_.isEmpty(this.allFkTableNames)) {
        this.populateFkPackageComponents(index)
      }
      if (_.indexOf(this.allFkTableNames, table) === -1) {
        // console.log('resetting...')
        table = this.allFkTableNames[0]
        // console.log(`table now is ${table}`)
        // this.setFkPackageTable(index, this.currentLocalHotId, table)
        // TODO: check for loop.
        // this.pushForeignKeysForeignTableForTable({ hotId: this.currentLocalHotId, index: index, resource: table })
      }
      return table
    },
    toggleFkPackage: function(index) {
      // this.isFkPackageVisible = !this.isFkPackageVisible
      console.log('toggling...')
      // console.log(this.isFkPackageVisible)
      this.updateFkPackageIndex(index, !this.fkPackages[index])
      // this.toggleText[index] = this.fkPackages[index] ? 'Switch to FK Local Table' : 'Switch to FK Package URL'
      // console.log(this.fkPackages)
      // fkPackages$.next(this.fkPackages)
      // this.fkPackages[index] = !this.fkPackages[index]
      // if (!this.fkPackages[index]) {
      //   this.allFkTableNames.length = 0
      //   this.allFkTableNamesHeaderNames = {}
      // }
      this.removeForeignKeysForeignPackageForTable({ index: index, hotId: this.currentLocalHotId })
      this.resetForeignKeysForeignTableForTable({ index: index, hotId: this.currentLocalHotId })
      this.resetForeignKeysForeignFieldsForTable({ index: index, hotId: this.currentLocalHotId })
      this.allFkTableNames = []
      this.allFkTableNamesHeaderNames = {}
      // button text won't re-render on its own
      // this.$forceUpdate()
    },
    getFkPackage: function(index) {
      // console.log(this.currentLocalHotId)
      console.log('getting fk package...')
      if (this.loadingPackage[index]) {
        console.log(`index is:`, index)
        return this.loadingPackage[index]
      }
      let foreignKeys = this.getAllForeignKeysFromCurrentHotId()
      let foreignKey = foreignKeys[index] || {}
      let reference = foreignKey.reference || {}
      // let dataPackage
      if (typeof reference.package !== 'undefined') {
        // let dataPackage = reference.package
        // if (_.isEmpty(this.allFkTableNamesHeaderNames)) {
        //   this.allFkTableNamesHeaderNames = this.getFkPackageComponents(dataPackage)
        //   if (!_.isEmpty(this.allFkTableNamesHeaderNames)) {
        //     this.allFkTableNames = _.keys(this.allFkTableNamesHeaderNames)
        //   }
        // }
        return reference.package
      }
      // let dataPackage = this.populateFkPackageComponents(index)
      // if (!dataPackage) {
      // TODO: resetting causes infinite loop
      // this.removeForeignKeysForeignPackageForTable({ index: index, hotId: this.currentLocalHotId })
      // this.resetForeignKeysForeignTableForTable({ index: index, hotId: this.currentLocalHotId })
      // this.resetForeignKeysForeignFieldsForTable({ index: index, hotId: this.currentLocalHotId })
      // } else {
      //   return dataPackage
      // }
    },
    populateFkPackageComponents: function(index) {
      // console.log('populating fk package components...')
      let foreignKeys = this.getAllForeignKeysFromCurrentHotId()
      let foreignKey = foreignKeys[index] || {}
      let reference = foreignKey.reference || {}
      let dataPackage
      if (typeof reference.package !== 'undefined') {
        dataPackage = reference.package
        if (_.isEmpty(this.allFkTableNamesHeaderNames)) {
          // console.log(`about to get fk package components as headers are empty...`)
          this.allFkTableNamesHeaderNames = this.getFkPackageComponents(dataPackage)
          // console.log('...populating table names')
          this.allFkTableNames = _.keys(this.allFkTableNamesHeaderNames)
        }
      }
      return dataPackage
    },
    setFkPackage: async function(index, hotId, value) {
      this.loadingPackage[index] = value
      loadingPackage$.next(index)
      // this.pushForeignKeysForeignPackageForTable({ hotId: hotId, index: index, package: value })
      let isValid = await this.validatePackageUrl(`fk-package${index}`, index, hotId, value)
      if (isValid) {
        ipc.send('loadPackageUrl', index, hotId, value)
        // this.loadingPackage = true
        // return true
        // let temp = this.startLoadingPackageFeedback
      }
      // console.log('returning from set fk package...')
      console.log(this.loadingPackage)
    },
    stopLoadingPackageFeedback: function(index) {
      console.log(`index is:`, index)
      console.log('about to stop loading package feedback...')
      console.log(this.loadingPackage)
      // let self = this
      this.loadingPackage[index] = false
      // _.delay(function() {
      //   console.log(`index is:`, index)
      //   self.loadingPackage[index] = false
      //   console.log(self.loadingPackage)
      // }, 10000)
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
      // console.log('getting current package foreign headers')
      // console.log(`index is ${index}`)
      let currentTable = this.getFkPackageTable(index)
      const currentTableName = currentTable()
      // console.log(`current table is ${currentTableName}`)
      // console.log(this.allFkTableNamesHeaderNames)
      if (currentTableName) {
        // console.log(`current table name is: ${currentTableName}`)
        // TODO: the cached package components should already be filled when package is realised
        // this.populateFkPackageComponents(index)
        // console.log(`returning in package foreign head${currentTableName}`)
        // this.$forceUpdate()
        return this.allFkTableNamesHeaderNames[currentTableName]
      // } else {
        // console.log('returning nothing')
        // return []
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
      // _.unset(this.toggleText, index)
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
      // this.toggleText[this.fkPackages.length] = false
      this.updateToggleText()
      this.initTableHeaderKeys()
    },
    updateSubscriptions: async function(allTablesAllColumnNames, hotId) {
      console.log('updating subscriptions...')
      try {
        let localHotId = await this.currentHotId()
        console.log(`local hot id`, localHotId)
        console.log(`passed in active hot id`, hotId)
        this.localHeaderNames.length = 0
        let headerNames = this.getHotIdHeaderNames(allTablesAllColumnNames, localHotId)
        this.localHeaderNames.push(...headerNames)
        // this.$forceUpdate(this.localHeaderNames)
        this.$forceUpdate()
        console.log()
      } catch (err) {
        console.log(`There was a problem updating subscriptions.`, err)
      }
    },
    updateTableSubscriptions: function(allTabsTitles) {
      console.log('updating table subscriptions...')
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
      let hotId = this.getSyncHotIdFromTabId(tabId)
      return hotId
    },
    getSelectedLocalKeys: function(index) {
      // console.log('local key get triggered...')
      let foreignKeys = this.getAllForeignKeysFromCurrentHotId()
      let foreignKey = foreignKeys[index] || {}
      let headers = foreignKey.fields || []
      return headers
    },
    getFkPackageTable: function(index) {
      console.log('getting fk package table...')
      let foreignKeys = this.getAllForeignKeysFromCurrentHotId()
      // // console.log(`foreign keys is: `)
      let foreignKey = foreignKeys[index] || {}
      let reference = foreignKey.reference || {}
      // // console.log(`table in fk package table is: ${table}`)
      // // TODO: check reference here doesn't attempt to update vuex
      const table = this.getFkPackageTableOrDefault(reference.resource, index)
      // // console.log(`table is in fk package table now: ${table}`)
      return function() {
        // console.log(`returning: ${table}`)
        return table
        // return null
      }
    },
    getSelectedTable: function(index) {
      // console.log('get selected table triggered...')
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
      console.log('returning get selected foreign keys...')
      return headers
    },
    // getSelectedFkPackageForeignKeys: function(index) {
    //   let columnArray = this.getSelectedForeignKeys(index)
    //   return _.join(columnArray)
    // },
    pushSelectedLocalKeys: function(index, hotId) {
      // console.log('pushing selected local keys...')
      // console.log('this fkpackagevisible:', this.isFkPackageVisible)
      let vueSetProperty = this.pushForeignKeysLocalFieldsForTable
      return function(headers) {
        let object = { hotId: hotId, index: index, fields: headers }
        vueSetProperty(object)
      }
    },
    setFkPackageTable: function(index, hotId, table) {
      // console.log('setting fk package table')
      // console.log(table)
      // table = this.getFkPackageTableOrDefault(table)
      // console.log(`table is set fk package table is now: ${table}`)
      // if (table) {
      // console.log(`table is set fk package table is now: ${table}`)
      let vueSetProperty = this.pushForeignKeysForeignTableForTable
      return function(table) {
        // console.log(`returning ${table}`)
        let object = { hotId: hotId, index: index, resource: table }
        vueSetProperty(object)
      }
      // }
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
        console.log('pushing table...')
        vueSetProperty(object)
      }
    },
    pushSelectedForeignKeys: function(index, hotId) {
      console.log(`hot id:`, hotId)
      // const testHotId = await this.currentHotId()
      // console.log(`current hot id`, testHotId)
      let vueSetProperty = this.pushForeignKeysForeignFieldsForTable
      return async function(headers) {
        console.log(`pushing headers`)
        console.log(headers)
        const activeHotId = await this.currentHotId()
        console.log(`current hot id in push:`, activeHotId)

        // switching tab may misalign setter trigger - ensure active tab has not changed
        if (activeHotId === hotId) {
          let object = { hotId: hotId, index: index, fields: headers }
          vueSetProperty(object)
        }
        // this.$forceUpdate()
      }
    },
    // setFkPackageColumns: function(index, hotId, value) {
    //   let columnArray = _.split(value, ',')
    //   this.pushForeignKeysForeignFieldsForTable({ hotId: hotId, index: index, fields: columnArray })
    // },
    getCurrentTitle: function() {
      // console.log('getting current title...')
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
      // console.log('updating toggle text...')
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
        // console.log(resource)
        this.allFkTableNames.push(resource.name)
        // console.log(resource.name)
        // console.log(resource.schema.fieldNames)
        this.allFkTableNamesHeaderNames[resource.name] = resource.schema.fieldNames
        this.pushFkPackageComponents({
          url: url,
          tableName: resource.name,
          fields: resource.schema.fieldNames
        })
      }
      // console.log('after updating fk components')
      // console.log(this.fkPackages)
      // const allHotForeignKeys = await this.hotForeignKeys
      // console.log(allHotForeignKeys)
      // console.log(this.currentLocalHotId)
      // this.updateFkType(allHotForeignKeys, this.currentLocalHotId)
      // console.log(this.allFkTableNames)
      // console.log(this.allFkTableNamesHeaderNames)
    }
    // refreshFkComponents: function() {
    //   const fkComponents = getFkPackageComponents
    //   console.log('current fk packages', this.fkPackages)
    //   this.fkPackages[index]
    // }
  },
  created: async function() {
    const vueUpdateTableSubscriptions = this.updateTableSubscriptions
    // const vueRefreshFkComponents = this.refreshFkComponents
    this.$subscribeTo(allTabsTitles$, function(allTabsTitles) {
      // console.log('subscription triggered...')
      vueUpdateTableSubscriptions(allTabsTitles)
      // vueRefreshFkComponents()
    })
    const vuePushForeignKeysForeignPackageForTable = this.pushForeignKeysForeignPackageForTable
    const vueUpdateFkComponents = this.updateFkComponents
    const vueUpdateFkPackageIndex = this.updateFkPackageIndex
    const vueStopLoadingPackageFeedback = this.stopLoadingPackageFeedback
    // const hasDataPackage = false
    ipc.on('packageUrlLoaded', async function(event, index, hotId, url, descriptor) {
      vueStopLoadingPackageFeedback(index)
      // loadingPackage$.next(-1)
      // dataPackage once sent from main is a string - need to load again to get 'Package' instance
      const dataPackage = await Package.load(descriptor)
      if (dataPackage && dataPackage.valid) {
        // console.log(dataPackage)
        vueUpdateFkPackageIndex(index, true)
        vuePushForeignKeysForeignPackageForTable({ hotId: hotId, index: index, package: url })
        await vueUpdateFkComponents(dataPackage, url)
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
