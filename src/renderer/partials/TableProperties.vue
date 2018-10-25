<template>
  <form
    id="tableProperties"
    class="navbar-form form-horizontal">
    <div class="form-group-sm row container-fluid">
      <div
        v-for="(formprop, index) in formprops"
        :key="index"
        class="propertyrow">
        <label
          v-tooltip.left="tooltip(formprop.tooltipId)"
          v-show="formprop.label"
          :for="formprop.label"
          class="control-label">{{ formprop.label }}</label>
        <component :is="formprop.tooltipView"/>
        <input
          v-if="formprop.key === 'missingValues'"
          :value="missingValues"
          :id="formprop.key"
          type="text"
          class="form-control input-sm col-sm-9"
          @input="setMissingValuesWithSingleEmpty($event.target.value)" >
        <textarea
          v-else-if="formprop.key === 'description'"
          :value="getProperty(formprop.key)"
          :id="formprop.key"
          rows="4"
          class="form-control label-sm col-sm-9"
          @input="setProperty(formprop.key, $event.target.value)" />
        <component
          v-else-if="isSharedComponent(formprop.key)"
          :propertyName="formprop.key"
          :getProperty="getProperty"
          :getPropertyGivenHotId="getPropertyGivenHotId"
          :setProperty="setProperty"
          :waitForHotIdFromTabId="waitForHotIdFromTabId"
          :currentHotId="currentHotId"
          :is="formprop.key"/>
        <input
          v-validate="validationRules(formprop.key)"
          v-else
          :class="{ 'form-control input-sm col-sm-9': true, 'validate-danger': errors.has(formprop.key) }"
          :id="formprop.key"
          :value="getProperty(formprop.key)"
          :name="formprop.key"
          type="text"
          @input="setProperty(formprop.key, $event.target.value)">
        <div
          v-show="errors.has(formprop.key) && removeValue(formprop.key)"
          class="row help validate-danger">
          {{ errors.first(formprop.key) }}
        </div>
      </div>
    </div>
  </form>
</template>
<script>
import {
  mapMutations,
  mapGetters
} from 'vuex'
import SideNav from './SideNav'
import Vue from 'vue'
import AsyncComputed from 'vue-async-computed'
import licenses from '../partials/Licenses'
import sources from '../partials/Sources'
import primaryKeys from '../partials/PrimaryKeys'
import foreignKeys from '../partials/ForeignKeys'
import {
  HotRegister
} from '../hot.js'
import TableTooltip from '../mixins/TableTooltip'
import ValidationRules from '../mixins/ValidationRules'
import autosize from 'autosize'
Vue.use(AsyncComputed)
export default {
  name: 'Tabular',
  components: {
    licenses,
    sources,
    primaryKeys,
    foreignKeys
  },
  extends: SideNav,
  mixins: [ValidationRules, TableTooltip],
  data() {
    return {
      formprops: [{
        label: 'Name*',
        key: 'name',
        tooltipId: 'tooltip-table-name',
        tooltipView: 'tooltipTableName'
      }, {
        label: 'Title',
        key: 'title',
        tooltipId: 'tooltip-table-title',
        tooltipView: 'tooltipTableTitle'
      },
      {
        label: 'Description',
        key: 'description',
        tooltipId: 'tooltip-table-description',
        tooltipView: 'tooltipTableDescription'
      },
      {
        label: 'Source(s)',
        key: 'sources',
        type: 'dropdown',
        tooltipId: 'tooltip-table-sources',
        tooltipView: 'tooltipTableSources'
      },
      {
        label: 'License(s)',
        key: 'licenses',
        tooltipId: 'tooltip-table-licences',
        tooltipView: 'tooltipTableLicences'
      },
      {
        label: 'Primary key(s)',
        key: 'primaryKeys',
        tooltipId: 'tooltip-table-primary-keys',
        tooltipView: 'tooltipTablePrimaryKeys'
      },
      {
        // label: 'Foreign key(s)',
        key: 'foreignKeys'
        // tooltipId: 'tooltip-table-foreign-keys',
        // tooltipView: 'tooltipTableForeignKeys'
      },
      {
        label: 'Missing value(s)',
        type: 'array',
        key: 'missingValues',
        tooltipId: 'tooltip-table-missing-values',
        tooltipView: 'tooltipTableMissingValues'
      }
      ]
    }
  },
  asyncComputed: {
    async missingValues() {
      let values = await this.getArrayValues('missingValues')
      return values
    }
  },
  computed: {
    ...mapGetters(['getActiveTab', 'getTableProperty', 'getHotTabs'])
  },
  methods: {
    ...mapMutations([
      'pushTableProperty'
    ]),
    getArrayValues: async function(key) {
      let tabId = this.getActiveTab
      let values = await this.getArrayValuesWithoutEmptiesFromTabId(key, tabId)
      // ensure re-render in input
      this.$forceUpdate()
      return values
    },
    setMissingValuesWithSingleEmpty: function(value) {
      let withoutEmpties = this.removeEmptyMissingValueMarkersFromString(value)
      let withSingleEmpty = `${withoutEmpties},`
      this.setArrayValues('missingValues', withSingleEmpty)
    },
    setArrayValues: function(key, value) {
      // TODO : hotId could be cached for all methods using it.
      let hot = HotRegister.getActiveInstance()
      if (hot) {
        let array = Array.from(new Set(value.split(',')))
        this.pushTableProperty({
          hotId: hot.guid,
          key: key,
          value: array
        })
      }
    },
    getArrayValuesWithoutEmptiesFromTabId: async function(key, tabId) {
      let withEmpties = await this.getArrayValuesFromTabId(key, tabId)
      let withoutEmpties = this.removeEmptyMissingValueMarkersFromString(withEmpties)
      return withoutEmpties
    },
    removeEmptyMissingValueMarkersFromString: function(string) {
      let withoutInternalEmpties = string.replace(/[,]+/g, ',')
      // also remove 'empty' if at start or end
      let trimmed = _.trim(withoutInternalEmpties, ',')
      return trimmed
    },
    getArrayValuesFromTabId: async function(key, tabId) {
      let hotId = await this.waitForHotIdFromTabId(tabId)
      if (hotId) {
        let array = this.getTableProperty({
          hotId: hotId,
          key: key
        }) || ['']
        let string = array.join()
        return string
      }
    },
    getProperty: function(key) {
      return this.getTableProperty(this.propertyGetObject(key))
    },
    getPropertyGivenHotId: function(key, hotId) {
      return this.getTableProperty(this.propertyGetObjectGivenHotId(key, hotId))
    },
    setProperty: function(key, value) {
      this.pushTableProperty(this.propertySetObject(key, value))
    },
    removeValue: function(key) {
      this.pushTableProperty(this.propertySetObject(key, ''))
      return true
    }
  },
  mounted: function() {
    this.$validator.extend('unique_name', {
      getMessage: field => `There is already another tab with this ${field}.`,
      validate: value => new Promise((resolve) => {
        let currentNames = _.values(_.mapValues(this.getHotTabs, function(hotTab) {
          return hotTab.tableProperties ? hotTab.tableProperties.name : ''
        }))
        let otherNames = _.without(currentNames, ...value)
        resolve({
          valid: currentNames.length - otherNames.length <= 1
        })
      })
    })
    autosize(document.querySelector('textarea'))
  }
}
</script>
<style lang="styl" scoped>
@import '~static/css/validationrules'
</style>
<style lang="styl" scoped>
@import '~static/css/sidenav'
</style>
