<template>
  <form
    id="columnProperties"
    class="navbar-form form-horizontal">
    <div class="form-group-sm row container-fluid">
      <div
        v-for="(formprop, index) in formprops"
        :key="index"
        class="propertyrow">
        <template v-if="!isExtraPropertyKey(formprop.key) || isExtraPropertyType(typeProperty, formprop.key)">
          <label
            v-tooltip.left="tooltip(formprop.tooltipId)"
            :for="formprop.key"
            class="control-label col-sm-3">
            {{ formprop.label }}
          </label>
        </template>
        <component :is="formprop.tooltipView"/>
        <template v-if="typeof formprop.type && formprop.type === 'dropdown'">
          <select
            v-if="formprop.key==='type'"
            :value="getTypeProperty"
            v-model="typeProperty"
            :id="formprop.key"
            class="form-control input-sm col-sm-9"
            @input="setTypeProperty($event.target.value)">
            <option
              v-for="option1 in typeValues"
              :key="option1"
              :value="option1">
              {{ option1 }}
            </option>
          </select>
          <div
            v-if="formprop.key==='format'"
            id="format-container"
            :class="{ 'format-pattern': formatValuesHasPattern }">
            <span
              v-tooltip.notrigger.left="tooltipWrap(formprop.tooltipValueId, warningVisibility)"
              v-if="hasTypeFormatWarning">
              <select
                id="format"
                :value="getFormatProperty"
                v-model="formatProperty"
                :disabled="isDropdownFormatDisabled"
                class="form-control input-sm col-sm-9"
                @input="setFormatProperty($event.target.value)">
                <option
                  v-for="option2 in formatPropertiesForType"
                  :key="option2"
                  :value="option2">
                  {{ option2 }}
                </option>
              </select>
              <component :is="formprop.tooltipValueView"/>
            </span>
            <span v-else>
              <select
                id="format"
                :value="getFormatProperty"
                v-model="formatProperty"
                :disabled="isDropdownFormatDisabled"
                class="form-control input-sm col-sm-9"
                @input="setFormatProperty($event.target.value)">
                <option
                  v-for="option2 in formatPropertiesForType"
                  :key="option2"
                  :value="option2">
                  {{ option2 }}
                </option>
              </select>
            </span>
            <input
              v-validate.initial="'formatPattern|required'"
              v-if="formatValuesHasPattern"
              v-model="formatPropertyValue"
              :class="{ 'form-control input-sm col-sm-9': true, 'validate-danger': errors.has('formatValue') }"
              type="text"
              name="formatValue">
            <div
              v-show="formatValuesHasPattern && errors.has('formatValue')"
              class="row help validate-danger">
              {{ errors.first('formatValue') }}
            </div>
          </div>
        </template>
        <div
          v-else-if="formprop.key === 'constraints'"
          id="constraints"
          class="col-sm-9">
          <div
            v-for="option in constraintValues"
            :key="option"
            class="input-group row">
            <input
              :id="option"
              :checked="getConstraintCheck(option)"
              type="checkbox"
              @click="setConstraintCheck(option, $event.target)" >
            <label
              :for="option"
              class="form-control-static">{{ option }}</label>
            <template v-if="!isBooleanConstraint(option) && getConstraintCheck(option)">
              <input
                v-validate.initial="constraintValidationRules(option)"
                :class="{ 'form-group-sm constraint-text': true,'validate-danger': errors.has(option) }"
                :value="getConstraintValue(option)"
                :name="option"
                type="text"
                @input="setConstraintValue(option, $event.target.value)">
            </template>
            <div
              v-show="errors.has(option) && removeConstraint(option)"
              class="row help validate-danger">
              {{ errors.collect(option)[0] }}
            </div>
          </div>
        </div>
        <textarea
          v-else-if="formprop.key === 'description'"
          :value="getProperty(formprop.key)"
          :id="formprop.key"
          rows="4"
          class="form-control label-sm col-sm-9"
          @input="setProperty(formprop.key, $event.target.value)" />
        <input
          v-else-if="formprop.key === 'name'"
          :disabled="formprop.isDisabled"
          :value="getNameProperty"
          :id="formprop.key"
          type="text"
          class="form-control label-sm col-sm-9"
          @input="setProperty(formprop.key, $event.target.value)" >
        <template v-else-if="formprop.key === 'rdfType'" >
          <input
            v-validate="{url:true}"
            :value="getProperty(formprop.key)"
            :class="{ 'form-control input-sm col-sm-9': true, 'validate-danger': errors.has(formprop.key) }"
            :id="formprop.key"
            :name="formprop.key"
            type="text"
            @input="setProperty(formprop.key, $event.target.value)">
          <div
            v-show="formprop.key === 'rdfType' && errors.has(formprop.key)"
            class="row help validate-danger">
            {{ errors.first(formprop.key) }}
          </div>
        </template>
        <template v-else-if="formprop.key === 'booleanType'">
          <div
            v-show="typeProperty === 'boolean'"
            class="extra-types input-group">
            <label
              class="inline control-label col-sm-3"
              for="trueValues">True Values</label>
            <input
              id="trueValues"
              :value="getTrueValues()"
              type="text"
              class="form-control label-sm col-sm-9"
              @blur="setTrueValues($event.target.value)" >
          </div>
          <div
            v-show="typeProperty === 'boolean'"
            class="extra-types input-group">
            <label
              class="inline control-label col-sm-3"
              for="falseValues">False Values</label>
            <input
              id="falseValues"
              :value="getFalseValues()"
              type="text"
              class="form-control label-sm col-sm-9"
              @blur="setFalseValues($event.target.value)" >
          </div>
        </template>
        <template v-else-if="formprop.key === 'numberType'">
          <div
            v-for="(extraType, eIndex) in formprop.types"
            v-show="typeProperty === 'number'"
            :key="'number' + eIndex"
            class="extra-types input-group">
            <label
              :for="formprop.key + extraType"
              class="inline control-label col-sm-3">{{ getExtraPropertyLabel(extraType) }}</label>
            <input
              v-if="extraType === 'bareNumber'"
              :id="formprop.key + extraType"
              :checked="getExtraType(extraType)"
              type="checkbox"
              @click="setBareNumber($event.target)" >
            <input
              v-validate="{max:1}"
              v-else
              :value="getExtraType(extraType)"
              :class="{ 'form-control label-sm col-sm-9': true,'validate-danger': errors.has(formprop.key + extraType) }"
              :id="formprop.key + extraType"
              :name="formprop.key + extraType"
              type="text"
              @input="setExtraType(extraType, $event.target.value)"
              @blur="removeOnError(`${formprop.key}${extraType}`, extraType)">
            <div
              v-show="errors.has(formprop.key + extraType)"
              class="row help validate-danger">
              {{ errors.first(formprop.key + extraType) }}
            </div>
          </div>
        </template>
        <template v-else-if="formprop.key === 'integerType'">
          <div
            v-for="(extraType, eIndex) in formprop.types"
            v-show="typeProperty === 'integer'"
            :key="'integer' + eIndex"
            class="extra-types input-group">
            <template v-if="extraType === 'bareNumber'">
              <label
                :for="formprop.key + extraType"
                class="inline control-label col-sm-3">{{ getExtraPropertyLabel(extraType) }}</label>
              <input
                :id="formprop.key + extraType"
                :checked="getExtraType(extraType)"
                type="checkbox"
                @click="setBareNumber($event.target)" >
            </template>
          </div>
        </template>
        <input
          v-else
          :disabled="formprop.isDisabled"
          :value="getProperty(formprop.key)"
          :id="formprop.key"
          type="text"
          class="form-control label-sm col-sm-9"
          @input="setProperty(formprop.key, $event.target.value)" >
      </div>
    </div>
  </form>
</template>
<script>
import SideNav from './SideNav'
import autosize from 'autosize'
import {
  mapMutations,
  mapGetters
} from 'vuex'
import AsyncComputed from 'vue-async-computed'
import VueRx from 'vue-rx'
import Vue from 'vue'
import {
  Subscription
} from 'rxjs/Subscription'
import {
  allTablesAllColumnNames$,
  allTablesAllColumnsFromSchema$
} from '@/rxSubject.js'
import ColumnTooltip from '../mixins/ColumnTooltip'
import ValidationRules from '../mixins/ValidationRules'
import { isValidPatternForType } from '@/dateFormats.js'
import { castBoolean, castNumber, castInteger } from 'tableschema/lib/types'
import { ERROR as tableSchemaError } from 'tableschema/lib/config'
Vue.use(VueRx, {
  Subscription
})
Vue.use(AsyncComputed)
export default {
  name: 'Column',
  extends: SideNav,
  mixins: [ValidationRules, ColumnTooltip],
  props: {
    cIndex: {
      type: Number,
      default: 0
    },
    reselectHotCell: {
      type: Function
    }
  },
  data() {
    return {
      typeValues: ['string', 'number', 'integer', 'boolean', 'object', 'array', 'date', 'time', 'datetime', 'year', 'yearmonth', 'duration', 'geopoint', 'geojson', 'any'],
      typeProperty: '',
      formatProperty: '',
      formatPropertyValue: '',
      constraintInputKeyValues: {},
      warningVisibility: false,
      allTablesAllColumnsNames: {},
      // TODO: setup args so clear for constraints only
      debounceSetConstraints: _.debounce(this.pushColumnProperty, 300, {
        'leading': true,
        'trailing': false
      }),
      debounceCheckType: _.debounce(this.checkType, 300, {
        'leading': true,
        'trailing': false
      }),
      formprops: [{
        label: 'Name*',
        key: 'name',
        tooltipId: 'tooltip-column-name',
        tooltipView: 'tooltipColumnName',
        isDisabled: true
      },
      {
        label: 'Title',
        key: 'title',
        tooltipId: 'tooltip-column-title',
        tooltipView: 'tooltipColumnTitle'
      },
      {
        label: 'Description',
        key: 'description',
        tooltipId: 'tooltip-column-description',
        tooltipView: 'tooltipColumnDescription'
      },
      {
        label: 'Type',
        key: 'type',
        tooltipId: 'tooltip-column-type',
        tooltipView: 'tooltipColumnType',
        type: 'dropdown'
      },
      {
        label: 'Boolean types',
        key: 'booleanType'
      },
      {
        label: 'Number types',
        key: 'numberType',
        types: ['decimalChar', 'groupChar', 'bareNumber']
      },
      {
        label: 'Integer types',
        key: 'integerType',
        types: ['bareNumber']
      },
      {
        label: 'Format',
        key: 'format',
        tooltipId: 'tooltip-column-format',
        tooltipView: 'tooltipColumnFormat',
        type: 'dropdown',
        tooltipValueView: 'tooltipColumnTypeDateDefault',
        tooltipValueId: 'tooltip-column-type-date-default'
      },
      {
        label: 'Constraints',
        key: 'constraints',
        tooltipId: 'tooltip-column-constraints',
        tooltipView: 'tooltipColumnConstraints',
        type: 'checkbox'
      },
      {
        label: 'RDF Type',
        key: 'rdfType',
        tooltipId: 'tooltip-column-rdfType',
        tooltipView: 'tooltipColumnRdfType',
        type: 'url'
      }
      ],
      formats: {
        'string': ['email', 'uri', 'binary', 'uuid', 'default'],
        'number': ['default'],
        'integer': ['default'],
        'boolean': ['default'],
        'object': ['default'],
        'array': ['default'],
        'date': ['any', 'pattern', 'default'],
        'time': ['any', 'pattern', 'default'],
        'datetime': ['any', 'pattern', 'default'],
        'year': ['default'],
        'yearmonth': ['default'],
        'duration': ['default'],
        'geopoint': ['array', 'object', 'default'],
        'geojson': ['topojson', 'default'],
        'any': ['default']
      },
      constraints: {
        'string': ['required', 'unique', 'minLength', 'maxLength', 'pattern', 'enum'],
        'number': ['required', 'unique', 'minimum', 'maximum', 'pattern', 'enum'],
        'integer': ['required', 'unique', 'minimum', 'maximum', 'pattern', 'enum'],
        'boolean': ['required', 'enum'],
        'object': ['required', 'unique', 'minLength', 'maxLength', 'enum'],
        'array': ['required', 'unique', 'minLength', 'maxLength', 'enum'],
        'date': ['required', 'unique', 'minimum', 'maximum', 'enum'],
        'time': ['required', 'unique', 'minimum', 'maximum', 'enum'],
        'datetime': ['required', 'unique', 'minimum', 'maximum', 'enum'],
        'year': ['required', 'unique', 'minimum', 'maximum', 'enum'],
        'yearmonth': ['required', 'unique', 'minimum', 'maximum', 'pattern', 'enum'],
        'duration': ['required', 'unique', 'minimum', 'maximum', 'enum'],
        'geopoint': ['required', 'unique', 'enum'],
        'geojson': ['required', 'unique', 'minLength', 'maxLength', 'enum'],
        'any': ['required', 'unique', 'enum']
      },
      constraintBooleanBindings: ['required', 'unique'],
      trueValues: ['true', 'True', 'TRUE', '1'],
      falseValues: ['false', 'False', 'FALSE', '0'],
      bareNumber: true,
      decimalChar: '.',
      groupChar: ''
    }
  },
  subscriptions() {
    return {
      allTablesAllColumns: allTablesAllColumnsFromSchema$
    }
  },
  asyncComputed: {
    getTypeProperty: {
      async get() {
        // type won't always have current hotid immediately available
        let hotId = await this.currentHotId()
        let getter = this.getter(hotId, 'type')
        let property = this.getHotColumnProperty(getter)
        if (!property) {
          property = 'any'
          this.pushColumnProperty(this.setter(hotId, 'type', property))
        }
        this.typeProperty = property
        return property
      },
      watch() {
        // eslint workarounds
        let temp = this.getActiveTab
        let temp2 = this.c-index
        let temp3 = this.allTablesAllColumns
      }
    },
    getFormatProperty: {
      async get() {
        // use promise for format's hotid to keep in sync with getTypeProperty
        let hotId = await this.currentHotId()
        let getter = this.getter(hotId, 'format')
        let property = this.getHotColumnProperty(getter)
        if (!property) {
          this.pushColumnProperty(this.setter(hotId, 'format', this.getDefaultFormatProperty()))
        }
        // ensure format value model is updated if this is a pattern (important after vue destroy->create)
        if (isValidPatternForType(property, this.typeProperty) && _.indexOf(this.formatPropertiesForType, 'pattern') > -1) {
          this.formatPropertyValue = property
          property = 'pattern'
        }
        this.formatProperty = property
        return property
      },
      watch() {
        let temp = this.getActiveTab
        let temp2 = this.c-index
        // ensure format also updates after setting type
        let temp3 = this.typeProperty
      }
    }
  },
  methods: {
    ...mapMutations([
      'pushColumnProperty', 'removeColumnProperty'
    ]),
    isBooleanConstraint: function(option) {
      return this.constraintBooleanBindings.indexOf(option) > -1
    },
    setTypeProperty: async function(value) {
      this.pushColumnProperty(this.setter(this.activeCurrentHotId || this.currentHotId(), 'type', value))
      this.typeProperty = value
      // keep format up-to-date with type
      if (_.indexOf(this.formatPropertiesForType, this.formatProperty) === -1 || this.typeProperty == 'date') {
        this.pushColumnProperty(this.setter(this.activeCurrentHotId || this.currentHotId(), 'format', this.getDefaultFormatProperty()))
      }
    },
    getDefaultFormatProperty: function() {
      return this.typeProperty == 'date' ? 'any' : 'default'
    },
    setFormatProperty: function(value) {
      // if it's a pattern, watcher will trigger appropriate method when this.formatProperty is set
      if (value !== 'pattern') {
        let hotId = this.activeCurrentHotId
        this.pushColumnProperty(this.setter(hotId, 'format', value))
      }
      this.formatProperty = value
    },
    setFormatPropertyValueForPattern: function() {
      let pattern = this.formatPropertyValue
      if (isValidPatternForType(pattern, this.typeProperty)) {
        let hotId = this.activeCurrentHotId
        this.pushColumnProperty(this.setter(hotId, 'format', pattern))
      }
    },
    getProperty: function(key) {
      let hotId = this.activeCurrentHotId
      let getter = this.getter(hotId, key)
      let property = this.getHotColumnProperty(getter)
      return property
    },
    setProperty: function(key, value) {
      this.pushColumnProperty(this.setter(this.activeCurrentHotId, key, value))
    },
    getter: function(hotId, key) {
      let object = {
        hotId: hotId,
        columnIndex: this.c-index,
        key: key
      }
      return object
    },
    setter: function(hotId, key, value) {
      let object = {
        hotId: hotId,
        columnIndex: this.c-index,
        key: key,
        value: value
      }
      return object
    },
    getConstraintCheck: function(key) {
      return _.has(this.constraintInputKeyValues, key)
    },
    setConstraintCheck: function(key, target) {
      const isChecked = target.checked
      if (!isChecked) {
        _.unset(this.constraintInputKeyValues, key)
      } else if (this.constraintBooleanBindings.indexOf(key) > -1) {
        this.constraintInputKeyValues[key] = isChecked
      } else {
        let getter = this.getter(this.activeCurrentHotId, key)
        let currentValue = this.getConstraint(getter) || ''
        this.constraintInputKeyValues[key] = currentValue
      }
      this.pushConstraintInputKeyValues()
      this.$forceUpdate()
      window.setTimeout(function() {
        let element = document.querySelector(`input[name=${key}]`)
        if (element) {
          element.focus()
        }
      }, 100)
    },
    getConstraintValue: function(key) {
      let value = this.constraintInputKeyValues[key]
      if (key === 'enum' && _.isArray(value)) {
        let updatedValue = `"${_.join(value, '","')}"`
        return updatedValue
      } else {
        return value
      }
    },
    removeConstraint: function(key) {
      _.unset(this.constraintInputKeyValues, key)
      this.pushConstraintInputKeyValues()
      return true
    },
    setConstraintValue: function(key, value) {
      this.constraintInputKeyValues[key] = value
      this.pushConstraintInputKeyValues()
    },
    pushConstraintInputKeyValues: function() {
      // assign to a separate object, so not influenced by validation's removal of invalid values
      let constraintValues = {}
      _.assign(constraintValues, this.constraintInputKeyValues)
      // transform enum to array using quote,comma as separator
      if (_.has(constraintValues, 'enum')) {
        let trimmed = _.trim(constraintValues.enum, '"')
        let split = _.split(trimmed, /"[\s]?,[\s]?"/)
        constraintValues.enum = split
      }
      this.sanitizeObjectValues(constraintValues)
      this.debounceSetConstraints(this.setter(this.activeCurrentHotId, 'constraints', constraintValues))
    },
    sanitizeObjectValues: function(constraintValues) {
      const keysToNumber = ['minLength', 'maxLength']
      for (const key of keysToNumber) {
        if (_.has(constraintValues, key) && _.isString(constraintValues[key])) {
          constraintValues[key] = _.toNumber(constraintValues[key])
        }
      }
    },
    constraintValidationRules: function(option) {
      switch (option) {
        case 'minLength':
        case 'maxLength':
          return 'numeric|required'
        case 'minimum':
        case 'maximum':
          return `${this.validationRules(this.typeProperty)}|required`
        default:
          return this.validationRules(option)
      }
    },
    updateConstraintInputKeyValues: function() {
      let hotId = this.activeCurrentHotId
      let getter = this.getter(hotId, 'constraints')
      let constraints = this.getHotColumnProperty(getter)
      this.constraintInputKeyValues = constraints || {}
    },
    updateAllTablesAllColumnsNames: function(update) {
      this.allTablesAllColumnsNames = update || {}
    },
    typePropertyWrapper: function() {
      return this.typeProperty
    },
    formatPropertyValueWrapper: function() {
      return this.formatPropertyValue
    },
    setTrueValues: function(values) {
      let withoutEmpties = this.removeStringEmpties(values)
      let array = this.getNoDuplicatesArrayFromString(withoutEmpties)
      this.setProperty('trueValues', array)
    },
    setFalseValues: function(values) {
      let withoutEmpties = this.removeStringEmpties(values)
      let array = this.getNoDuplicatesArrayFromString(withoutEmpties)
      this.setProperty('falseValues', array)
    },
    getNoDuplicatesArrayFromString: function(values) {
      return Array.from(new Set(values.split(',')))
    },
    getTrueValues: function() {
      return this.getBooleanValuesOrDefaultAsString('trueValues')
    },
    getFalseValues: function() {
      return this.getBooleanValuesOrDefaultAsString('falseValues')
    },
    getBooleanValuesOrDefaultAsString: function(booleanType) {
      let values = this.getBooleanValuesOrDefault(booleanType)
      return values.join()
    },
    getBooleanValuesOrDefault: function(booleanType) {
      let values
      if (booleanType === 'trueValues') {
        values = this.getProperty('trueValues')
        if (!values) {
          values = this.setAndGetDefaultTrueValues()
        }
      } else {
        values = this.getProperty('falseValues')
        if (!values) {
          values = this.setAndGetDefaultFalseValues()
        }
      }
      return values
    },
    setAndGetDefaultTrueValues: function() {
      let values = [...this.trueValues]
      this.setProperty('trueValues', values)
      return values
    },
    setAndGetDefaultFalseValues: function() {
      let values = [...this.falseValues]
      this.setProperty('falseValues', values)
      return values
    },
    removeStringEmpties: function(string) {
      let withoutInternalEmpties = string.replace(/[,]+/g, ',')
      // also remove 'empty' if at start or end
      let trimmed = _.trim(withoutInternalEmpties, ',')
      return trimmed
    },
    getExtraPropertyLabel: function(key) {
      return _.upperFirst(_.lowerCase(key))
    },
    isExtraPropertyKey: function(key) {
      return _.includes(['booleanType', 'integerType', 'numberType'], key)
    },
    isExtraPropertyType: function(type, key) {
      switch (type) {
        case 'boolean':
          return key === 'booleanType'
        case 'integer':
          return key === 'integerType'
        case 'number':
          return key === 'numberType'
        default:
          return false
      }
    },
    getExtraType: function(type) {
      let value = this.getProperty(type)
      if (typeof value === 'undefined') {
        switch (type) {
          case 'decimalChar':
            value = this.setAndGetDefaultDecimalChar()
            break
          case 'groupChar':
            value = this.setAndGetDefaultGroupChar()
            break
          case 'bareNumber':
            value = this.setAndGetDefaultBareNumber()
            break
          default:
            throw new Error(`Extra property type: ${type} is not supported for number`)
        }
      }
      return value
    },
    setBareNumber: function(target) {
      this.setExtraType('bareNumber', target.checked)
    },
    setExtraType: function(type, value) {
      switch (type) {
        case 'decimalChar':
        case 'groupChar':
        case 'bareNumber':
          this.setProperty(type, value)
          break
        default:
          throw new Error(`Extra property type: ${type} is not supported`)
      }
    },
    removeOnError: function(errorId, key) {
      if (this.errors.has(errorId)) {
        this.removeColumnProperty(this.setter(this.activeCurrentHotId, key))
      }
    },
    setAndGetDefaultBareNumber: function() {
      const value = this.bareNumber
      this.setProperty('bareNumber', value)
      return value
    },
    setAndGetDefaultGroupChar: function() {
      const value = this.groupChar
      this.setProperty('groupChar', value)
      return value
    },
    setAndGetDefaultDecimalChar: function() {
      const value = this.decimalChar
      this.setProperty('decimalChar', value)
      return value
    },
    // we cannot access frictionless' extra properties directly, so at least offer error message if not correct
    validateDefaultExtraProperties() {
      this.validateBooleans()
      this.validateGroupCharForNumber()
      this.validateDecimalCharForNumber()
      this.validateBareNumberForNumberAndInteger()
    },
    validateBooleans: function() {
      for (const booleanValues of [this.trueValues, this.falseValues]) {
        for (const value of booleanValues) {
          const result = castBoolean('default', value)
          this.inspectDefaultExtraPropertiesResult(result, `Boolean value: ${value} of ${booleanValues}`)
        }
      }
    },
    validateGroupCharForNumber: function() {
      const value = `10${this.groupChar}000`
      this.validateNumber(value, `Group char value ${this.groupChar}`)
    },
    validateDecimalCharForNumber: function() {
      const value = `10${this.decimalChar}000`
      this.validateNumber(value, `Decimal char value: ${this.decimalChar}`)
    },
    validateBareNumberForNumberAndInteger: function() {
      const value = this.bareNumber === true ? '23' : 'dummy23dummy'
      const message = `Bare Number ${this.bareNumber}`
      this.validateNumber(value, message)
      this.validateInteger(value, message)
    },
    validateNumber: function(value, message) {
      const result = castNumber('default', value)
      this.inspectDefaultExtraPropertiesResult(result, `Number's ${message}`)
    },
    validateInteger: function(value, message) {
      const result = castInteger('default', value)
      this.inspectDefaultExtraPropertiesResult(result, `Integer's ${message}`)
    },
    inspectDefaultExtraPropertiesResult: function(result, message) {
      if (result === tableSchemaError) {
        throw new Error(`${message} is not a valid default`, result)
      }
    },
    isWarningVisible: function() {
      return this.warningVisibility
    },
    checkType: function() {
      this.warningVisibility = this.hasTypeFormatWarning
    }
  },
  computed: {
    ...mapGetters([
      'getActiveTab', 'getHotColumnProperty', 'getConstraint', 'getAllHotTablesColumnNames'
    ]),
    hasTypeFormatWarning() {
      return (this.typeProperty == 'date' && this.formatProperty == 'default')
    },
    getNameProperty() {
      let allColumns = this.allTablesAllColumnsNames[this.activeCurrentHotId] || []
      return allColumns[this.c-index] || ''
    },
    formatValuesHasPattern() {
      return this.formatProperty === 'pattern' && _.indexOf(this.formatPropertiesForType, 'pattern') > -1
    },
    formatPropertiesForType() {
      let property = this.typeProperty || 'any'
      let choices = this.formats[property]
      return choices
    },
    constraintValues() {
      let property = this.typeProperty
      this.updateConstraintInputKeyValues()
      return this.constraints[property]
    },
    isDropdownFormatDisabled() {
      return !this.formatPropertiesForType ? false : this.formatPropertiesForType.length < 2
    }
  },
  watch: {
    'formatProperty': function(nextFormat) {
      if (nextFormat === 'pattern') {
        if (_.indexOf(this.formatPropertiesForType, 'pattern') > -1) {
          this.setFormatPropertyValueForPattern()
        }
      }
      this.debounceCheckType()
    },
    'formatPropertyValue': function() {
      this.setFormatPropertyValueForPattern()
    },
    'formatPropertiesForType': function() {
      this.debounceCheckType()
    }
  },
  mounted: function() {
    let vueUpdateAllTablesAllColumnsNames = this.updateAllTablesAllColumnsNames
    this.$subscribeTo(allTablesAllColumnNames$, function(result) {
      vueUpdateAllTablesAllColumnsNames(result)
    })
    allTablesAllColumnNames$.next(this.getAllHotTablesColumnNames())
    autosize(document.querySelector('textarea'))
  },
  created: function() {
    let vueType = this.typePropertyWrapper
    let vueFormat = this.formatPropertyValueWrapper
    this.$validator.extend('formatPattern', {
      getMessage: function(field) {
        return `The format pattern is not supported.`
      },
      validate: function(value) {
        return new Promise((resolve) => {
          let isValid = isValidPatternForType(vueFormat(), vueType())
          resolve({
            valid: isValid
          })
        })
      }
    })
    this.validateDefaultExtraProperties()
  }
}
</script>
<style lang="styl" scoped>
    @import '~static/css/columnprops'
</style>
<style lang="styl" scoped>
    @import '~static/css/validationrules'
</style>
<style lang="styl" scoped>
    @import '~static/css/tooltip'
</style>
