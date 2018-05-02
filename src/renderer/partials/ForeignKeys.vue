<template>
<div id="foreignKeyFields">
  <div v-for="(foreignKey,index) in hotForeignKeys"  class="foreign col-sm-12">
    <div class="inputs-container">
      <component :key="getLocalComponentKey(index)" is="tableheaderkeys" :activeNames="localHeaderNames" :getSelectedKeys="getSelectedLocalKeys(index)" :pushSelectedKeys="pushSelectedLocalKeys(index,currentLocalHotId)" labelName="Foreign key(s)" :tooltipId="'tooltip-foreignkey' + index" tooltipView="tooltipForeignkey" :index="index" />
      <component v-if="isHeadersSelected && !isFkPackageVisible && fkPackages[index] === false" :key="getTableComponentKey(index)" is="tablekeys" :allTableNames="allTableNames" :getSelectedTable="getSelectedTable(index)" :pushSelectedTable="pushSelectedForeignTable(index,currentLocalHotId)" labelName="Reference Table" :tooltipId="'tooltip-foreignkey-table' + index" tooltipView="tooltipForeignkeyTable" :index="index" />
      <component v-if="isHeadersSelected && !isFkPackageVisible && fkPackages[index] === false" :key="getForeignComponentKey(index)" is="tableheaderkeys" :activeNames="getCurrentForeignHeaders(index)" :getSelectedKeys="getSelectedForeignKeys(index)" :pushSelectedKeys="pushSelectedForeignKeys(index,currentLocalHotId)" labelName="Reference Column(s)" :tooltipId="'tooltip-foreignkey-tablekey' + index" tooltipView="tooltipForeignkeyTablekey" :index="index"/>
    </div>
    <button type="button" class="btn btn-danger btn-sm" @click="removeForeignKey(index)">
      <span class="glyphicon glyphicon-minus"/>
    </button>
    <div id="fk-package" class="clearfix">
      <template v-if="isHeadersSelected && isFkPackageVisible">
        <label class="control-label">Reference Package</label>
        <div class="fk-package" :class="{ 'right': !fkPackages[index]}">
          <input class="form-control input-sm" type="text" :id="'fk-package' + index" :value="getFkPackage(index)" @input="setFkPackage(index, currentLocalHotId, $event.target.value)" :name="'fk-package' + index" @blur="removeFkPackageForErrors(index, currentLocalHotId)" />
        </div>
        <div v-if="fkPackages[index] === true && errors.has('fk-package' + index)" class="row help validate-danger">
          {{ errors.first('fk-package' + index)}}
        </div>
        <div v-show="fkPackages[index]">
          <!-- <label class="control-label">Reference Table</label> -->
          <component :key="getTableComponentKey(index)" is="tablekeys" :allTableNames="allFkTableNames" :getSelectedTable.lazy="getFkPackageTable(index)" :pushSelectedTable.lazy="setFkPackageTable(index,currentLocalHotId)" labelName="Reference Table" :tooltipId="'tooltip-foreignkey-table' + index" tooltipView="tooltipForeignkeyTable" :index="index" />
          <!-- <input class="form-control input-sm" type="text" id="fk-package-table" name="fk-package-table" :value="getFkPackageTable(index)" @input="setFkPackageTable(index, currentLocalHotId, $event.target.value)" /> -->
          <!-- <label class="control-label">Reference Column(s)</label> -->
          <!-- <input class="form-control input-sm" type="text" id="fk-package-columns" name="fk-package-columns" :value="getFkPackageColumns(index)" @input="setFkPackageColumns(index, currentLocalHotId, $event.target.value)" /> -->
          <component :key="getForeignComponentKey(index)" is="tableheaderkeys" :activeNames="getCurrentPackageForeignHeaders(index)" :getSelectedKeys="getSelectedForeignKeys(index)" :pushSelectedKeys="pushSelectedForeignKeys(index,currentLocalHotId)" labelName="Reference Column(s)" :tooltipId="'tooltip-foreignkey-tablekey' + index" tooltipView="tooltipForeignkeyTablekey" :index="index"/>
        </div>
      </template>
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
        console.log(`getting hot foreign keys...`)
        let hotId = await this.currentHotId()
        this.currentLocalHotId = hotId
        this.allForeignKeys = this.getAllForeignKeys()
        let foreignKeys = this.allForeignKeys[hotId]
        console.log('updating fk type..')
        this.updateFkType(foreignKeys, hotId)
        return foreignKeys
      },
      watch() {
        let dummy = this.localHeaderNames
        let dummy2 = this.getActiveTab
        let dummy3 = this.isFkPackageVisible
        // let dummy4 = this.fkPackages
        // let dummy4 = this.pushForeignKeysForeignPackageForTable
      }
    },
    isHeadersSelected: {
      async get() {
        let isSelected = this.localHeaderNames.length > 0
        console.log(`is headers selected: ${isSelected}`)
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
      isFkPackageVisible: false
    }
  },
  computed: {
  },
  subscriptions() {
    return {
      allColumns: allTablesAllColumnNames$
    }
  },
  methods: {
    ...mapMutations([
      'pushForeignKeysForeignPackageForTable', 'removeForeignKeysForeignPackageForTable', 'resetForeignKeysForeignTableForTable', 'resetForeignKeysForeignFieldsForTable'
    ]),
    updateFkType: function(foreignKeys, hotId) {
      console.log('entered update fk type...')
      for (const [index, foreignKey] of foreignKeys.entries()) {
        let reference = foreignKey && foreignKey.reference
        console.log(`reference is`, reference)
        console.log(reference.package)
        this.fkPackages[index] = !!(reference && reference.package && reference.package.trim().length > 0)
        console.log(this.fkPackages[index])
      }
    },
    fkButtonMessage: function(index) {
      console.log('in button message, fk package index...')
      console.log(this.fkPackages[index])
      return this.isFkPackageVisible ? 'Switch to FK Local Table' : 'Switch to FK Package URL'
    },
    getFkPackageTableOrDefault: function(table, index) {
      if (_.indexOf(this.allFkTableNames, table) === -1 && !_.isEmpty(this.allFkTableNames)) {
        // console.log('resetting...')
        table = this.allFkTableNames[0]
        // console.log(`table now is ${table}`)
        // this.setFkPackageTable(index, this.currentLocalHotId, table)
        this.pushForeignKeysForeignTableForTable({ hotId: this.currentLocalHotId, index: index, resource: table })
      }
      return table
    },
    toggleFkPackage: function(index) {
      this.isFkPackageVisible = !this.isFkPackageVisible
      console.log('toggling...')
      console.log(this.isFkPackageVisible)
      this.fkPackages[index] = !this.fkPackages[index]
      // package will always be reset, so ensure that its table and fields are too
      if (!this.isFkPackageVisible) {
        this.allFkTableNames = []
        this.allFkTableNamesHeaderNames = {}
      }
      this.removeForeignKeysForeignPackageForTable({ index: index, hotId: this.currentLocalHotId })
      this.resetForeignKeysForeignTableForTable({ index: index, hotId: this.currentLocalHotId })
      this.resetForeignKeysForeignFieldsForTable({ index: index, hotId: this.currentLocalHotId })
    },
    getFkPackage: function(index) {
      let foreignKeys = this.getAllForeignKeysFromCurrentHotId()
      let foreignKey = foreignKeys[index] || {}
      let reference = foreignKey.reference || {}
      return reference.package
    },
    setFkPackage: async function(index, hotId, value) {
      this.pushForeignKeysForeignPackageForTable({ hotId: hotId, index: index, package: value })
      let isValid = await this.validatePackageUrl(`fk-package${index}`, index, hotId, value)
      if (isValid) {
        ipc.send('loadPackageUrl', index, hotId, value)
      }
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
      // console.log(`index is ${index}`)
      let currentTable = this.getFkPackageTable(index)
      const currentTableName = currentTable()
      // console.log(`current table is ${currentTableName}`)
      // console.log(this.allFkTableNamesHeaderNames)
      if (currentTableName) {
        // console.log(`returning in package foreign head${currentTableName}`)
        // this.$forceUpdate()
        return this.allFkTableNamesHeaderNames[currentTableName]
      } else {
        // console.log('returning nothing')
      }
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
      console.log('local key get triggered...')
      let foreignKeys = this.getAllForeignKeysFromCurrentHotId()
      let foreignKey = foreignKeys[index] || {}
      let headers = foreignKey.fields || []
      return headers
    },
    getFkPackageTable: function(index) {
      let foreignKeys = this.getAllForeignKeysFromCurrentHotId()
      // console.log(`foreign keys is: `)
      let foreignKey = foreignKeys[index] || {}
      let reference = foreignKey.reference || {}
      let table = reference.resource
      // console.log(`table in fk package table is: ${table}`)
      table = this.getFkPackageTableOrDefault(table, index)
      // console.log(`table is in fk package table now: ${table}`)
      return function() {
        // console.log(`returning: ${table}`)
        return table
      }
    },
    getSelectedTable: function(index) {
      console.log('get selected table triggered...')
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
      console.log('pushing selected local keys...')
      console.log('this fkpackagevisible:', this.isFkPackageVisible)
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
        vueSetProperty(object)
      }
    },
    pushSelectedForeignKeys: function(index, hotId) {
      let vueSetProperty = this.pushForeignKeysForeignFieldsForTable
      return function(headers) {
        console.log(`pushing headers`)
        console.log(headers)
        let object = { hotId: hotId, index: index, fields: headers }
        vueSetProperty(object)
        this.$forceUpdate()
      }
    },
    // setFkPackageColumns: function(index, hotId, value) {
    //   let columnArray = _.split(value, ',')
    //   this.pushForeignKeysForeignFieldsForTable({ hotId: hotId, index: index, fields: columnArray })
    // },
    getCurrentTitle: function() {
      console.log('getting current title...')
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
    },
    updateFkComponents: async function(dataPackage) {
      this.allFkTableNames = []
      this.allFkTableNamesHeaderNames = {}
      for (const resource of dataPackage.resources) {
        // console.log(resource)
        this.allFkTableNames.push(resource.name)
        // console.log(resource.name)
        // console.log(resource.schema.fieldNames)
        this.allFkTableNamesHeaderNames[resource.name] = resource.schema.fieldNames
      }
      console.log('after updating fk components')
      console.log(this.fkPackages)
      const allHotForeignKeys = await this.hotForeignKeys
      console.log(allHotForeignKeys)
      console.log(this.currentLocalHotId)
      // this.updateFkType(allHotForeignKeys, this.currentLocalHotId)
      // console.log(this.allFkTableNames)
      // console.log(this.allFkTableNamesHeaderNames)
    }
  },
  created: async function() {
    let vueUpdateTableSubscriptions = this.updateTableSubscriptions
    this.$subscribeTo(allTabsTitles$, function(allTabsTitles) {
      console.log('subscription triggered...')
      vueUpdateTableSubscriptions(allTabsTitles)
    })
    const vuePushForeignKeysForeignPackageForTable = this.pushForeignKeysForeignPackageForTable
    const vueUpdateFkComponents = this.updateFkComponents
    const vueUpdateFkPackageIndex = this.updateFkPackageIndex
    const hasDataPackage = false
    ipc.on('packageUrlLoaded', async function(event, index, hotId, url, descriptor) {
      // dataPackage once sent from main is a string - need to load again to get 'Package' instance
      const dataPackage = await Package.load(descriptor)
      if (dataPackage && dataPackage.valid) {
        console.log(dataPackage)
        vueUpdateFkPackageIndex(index, true)
        vuePushForeignKeysForeignPackageForTable({ hotId: hotId, index: index, package: url })
        await vueUpdateFkComponents(dataPackage)
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
