<template>
<form class="navbar-form form-horizontal" id="tableProperties">
  <div class="form-group-sm row container-fluid">
    <div class="propertyrow" v-for="(formprop, index) in formprops" :key="index">
      <template v-if="formprop.type !== 'hidden'">
        <label v-tooltip.left="tooltip(formprop.tooltipId)" class="control-label col-sm-3" :for="formprop.label">{{formprop.label}}:</label>
        <component :is="formprop.tooltipView"/>
        <input v-if="formprop.label === 'missing values'" :value="missingValues" @input="setMissingValues($event.target.value)" type="text" class="form-control input-sm col-sm-9" :id="formprop.label" />
        <input v-else-if="formprop.type === 'primary key(s)'" :value="primaryKeys" @input="setArrayValues(formprop.key, $event.target.value)" type="text" class="form-control input-sm col-sm-9" :id="formprop.label" />
        <!-- <input v-else-if="formprop.type === 'foreign key(s)'" :value="foreignKeys" @input="setArrayValues(formprop.key, $event.target.value)" type="text" class="form-control input-sm col-sm-9" :id="formprop.label" /> -->
        <component v-else-if="isSharedComponent(formprop.label)" :getProperty="getProperty" :getPropertyGivenHotId="getPropertyGivenHotId" :setProperty="setProperty" :waitForHotIdFromTabId="waitForHotIdFromTabId" :is="formprop.label"/>
        <input v-else type="text" :class="{ 'form-control input-sm col-sm-9': true, 'validate-danger': errors.has(formprop.label) }" :id="formprop.label" :value="getProperty(formprop.label)" @input="setProperty(formprop.label, $event.target.value)" v-validate="validationRules(formprop.label)" :name="formprop.label"/>
      </template>
      <div v-show="errors.has(formprop.label) && removeValue(formprop.label)" class="row help validate-danger">
        {{ errors.first(formprop.label)}}
      </div>
    </div>
  </div>
</form>
</template>
<script>
import {
  mapMutations,
  mapState,
  mapGetters
} from 'vuex'
import SideNav from './SideNav'
import Vue from 'vue'
import AsyncComputed from 'vue-async-computed'
import licenses from '../partials/Licenses'
import sources from '../partials/Sources'
import {
  HotRegister
} from '../hot.js'
import TableTooltip from '../mixins/TableTooltip'
import {
  Validator
} from 'vee-validate'
Vue.use(AsyncComputed)
export default {
  extends: SideNav,
  name: 'tabular',
  mixins: [TableTooltip],
  components: {
    licenses,
    sources
  },
  data() {
    return {
      formprops: [{
        label: 'name',
        tooltipId: 'tooltip-table-name',
        tooltipView: 'tooltipTableName'
      }, {
        label: 'title',
        tooltipId: 'tooltip-table-title',
        tooltipView: 'tooltipTableTitle'
      },
      {
        label: 'primary key(s)',
        type: 'array'
      },
      // {
      //   label: 'foreign key(s)',
      //   type: 'array'
      // },
      {
        label: 'profile',
        type: 'hidden',
        value: 'tabular-data-resource'
      },
      {
        label: 'description',
        tooltipId: 'tooltip-table-description',
        tooltipView: 'tooltipTableDescription'
      },
      {
        label: 'sources',
        type: 'dropdown',
        tooltipId: 'tooltip-table-sources',
        tooltipView: 'tooltipTableSources'
      },
      {
        label: 'licenses',
        tooltipId: 'tooltip-table-licences',
        tooltipView: 'tooltipTableLicences'
      },
      {
        label: 'format',
        type: 'hidden',
        value: 'csv'
      },
      {
        label: 'mediatype',
        type: 'hidden',
        value: 'text/csv'
      },
      {
        label: 'encoding',
        type: 'hidden',
        value: 'UTF-8'
      },
      {
        label: 'missing values',
        type: 'array',
        tooltipId: 'tooltip-table-missing-values',
        tooltipView: 'tooltipTableMissingValues'
      }]
    }
  },
  asyncComputed: {
    async missingValues() {
      let values = await this.getArrayValues('missingValues')
      return values
    },
    async primaryKeys() {
      let values = await this.getArrayValues('primaryKeys')
      return values
    },
    async foreignKeys() {
      let values = await this.getArrayValues('foreignKeys')
      return values
    }
  },
  computed: {
    ...mapGetters(['getMissingValuesFromHot', 'getActiveTab', 'getTableProperty', 'getHotTabs'])
  },
  methods: {
    ...mapMutations([
      'pushTableSchemaDescriptorProperty', 'pushTableProperty'
    ]),
    validationRules: function(label) {
      if (label === 'name') {
        return {
          required: true,
          regex: /^([-a-z0-9._/])+$/,
          verify_coupon: true
        }
      }
      return ''
    },
    getArrayValues: async function(key) {
      let tabId = this.getActiveTab
      let values = await this.getArrayValuesFromTabId(key, tabId)
      // ensure re-render in input
      this.$forceUpdate()
      return values
    },
    setArrayValues: function(key, value) {
      // TODO : hotId could be cached for all methods using it.
      let hot = HotRegister.getActiveInstance()
      if (hot) {
        let array = Array.from(new Set(value.split(',')))
        this.pushTableSchemaProperty({
          hotId: hot.guid,
          key: key,
          value: array
        })
      }
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
    setMissingValues: function(value) {
      let hot = HotRegister.getActiveInstance()
      if (hot) {
        let array = Array.from(new Set(value.split(',')))
        this.pushTableSchemaDescriptorProperty({
          hotId: hot.guid,
          key: 'missingValues',
          value: array
        })
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
  watch: {},
  beforeCreate: function() {
    this.$nextTick(function() {
      // set hidden inputs
      let found = this.formprops.forEach(x => {
        if (x.type === 'hidden') {
          this.setProperty(x.label, x.value)
        }
      })
    })
  },
  created: function() {
    const dictionary = {
      en: {
        custom: {
          name: {
            regex: () => 'The name field format is invalid. It must consist only of lowercase alphanumeric characters plus ".", "-" and "_".'
          }
        }
      }
    }
    Validator.updateDictionary(dictionary)
    Validator.extend('verify_coupon', {
      getMessage: field => `There is already another tab with this ${field}.`,
      validate: value => new Promise((resolve) => {
        let currentNames = _.values(_.mapValues(this.getHotTabs, function(hotTab) {
          return hotTab.tableProperties.name
        }))
        let otherNames = _.without(currentNames, value)
        resolve({
          valid: currentNames.length - otherNames.length <= 1
        })
      })
    })
  }
}
</script>
<style lang="styl" scoped>
@import '~static/css/validationrules'
</style>
