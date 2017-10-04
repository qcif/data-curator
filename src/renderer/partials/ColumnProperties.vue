<template>
<form class="navbar-form form-horizontal" id="columnProperties">
  <div class="form-group-sm row container-fluid">
    <div v-for="(formprop, index) in formprops" :key="index">
      <label v-tooltip.left.click="tooltip(formprop.tooltipId)" :style="{paddingLeft: '0'}" class="control-label col-sm-4" :for="formprop.label">{{formprop.label}}:</label>
      <component :is="formprop.tooltipView"/>
      <template v-if="typeof formprop.type && formprop.type === 'dropdown'">
        <select v-if="formprop.label==='type'" :value="getProperty(formprop.label)" @input="setSelectType($event.target.value)" :id="formprop.label" class="form-control input-sm col-sm-8">
          <option v-for="option in typeValues" v-bind:value="option">
            {{ option}}
          </option>
        </select>
        <select v-else-if="formprop.label==='format'" v-model="selectFormat" id="format" :disabled="isDropdownFormatDisabled" class="form-control input-sm col-sm-8">
          <option v-for="option in formatValues" v-bind:value="option">
            {{ option}}
          </option>
        </select>
      </template>
      <div v-else-if="formprop.label === 'constraints'" id="constraints" class="col-sm-8">
        <div v-for="option in constraintValues" class="input-group row">
          <input type="checkbox" :id="option" :value="option" v-model="selectConstraints"></input>
          <label for="option" class="form-control-static">{{option}}</label>
          <!-- <template v-if="[option] == 'boolean'"/> -->
          <input v-if="option" v-show="showConstraint(option)" type="text" class="constraint-text" :value="getConstraintValue(option)" @input="setConstraintValue(option, $event.target.value)"/>
        </div>
      </div>
      <input v-else :value="getProperty(formprop.label)" @input="setProperty(formprop.label, $event.target.value)" type="text" class="form-control input-sm col-sm-8" :id="formprop.label" />
    </div>
  </div>
  </div>
</form>
</template>
<script>
import {
  mapMutations,
  mapGetters,
  mapState
} from 'vuex'
import {
  remote
} from 'electron'
import SideNav from './SideNav'
import {
  HotRegister,
  getCurrentColumnIndexOrMin as getCurrentColumnIndex,
  reselectCurrentCellOrMin
} from '../hot.js'
const Dialog = remote.dialog
export default {
  extends: SideNav,
  name: 'column',
  props: ['getAllColumnsProperties', 'cIndex'],
  data() {
    return {
      typeValues: ['string', 'number', 'integer', 'boolean', 'object', 'array', 'date', 'time', 'datetime', 'year', 'yearmonth', 'duration', 'geopoint', 'geojson', 'any'],
      formatValues: [],
      constraintValues: [],
      selectConstraints: [],
      formprops: [{
        label: 'name',
        tooltipId: 'tooltip-column-name',
        tooltipView: 'tooltipColumnName'
      },
      {
        label: 'title',
        tooltipId: 'tooltip-column-title',
        tooltipView: 'tooltipColumnTitle'
      },
      {
        label: 'description',
        tooltipId: 'tooltip-column-description',
        tooltipView: 'tooltipColumnDescription'
      },
      {
        label: 'type',
        tooltipId: 'tooltip-column-type',
        tooltipView: 'tooltipColumnType',
        type: 'dropdown'
      },
      {
        label: 'format',
        tooltipId: 'tooltip-column-format',
        tooltipView: 'tooltipColumnFormat',
        type: 'dropdown'
      },
      {
        label: 'constraints',
        tooltipId: 'tooltip-column-constraints',
        tooltipView: 'tooltipColumnConstraints',
        type: 'checkbox'
      },
      {
        label: 'rdfType',
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
      constraintBooleanBindings: [
        'required',
        'unique'
      ],
      otherProperties: ['missingValues', 'primaryKey', 'foreignKey']
    }
  },
  methods: {
    ...mapMutations([
      'pushHotProperty'
    ]),
    showConstraint: function(option) {
      // console.log(this.selectConstraints[option])
      return this.constraintBooleanBindings.indexOf(option) === -1 && this.selectConstraints.indexOf(option) > -1
    },
    getProperty: function(key) {
      let allColumnsProperties = this.getAllColumnsProperties
      if (allColumnsProperties) {
        let activeColumnProperties = allColumnsProperties[this.cIndex]
        if (activeColumnProperties) {
          if (key === 'type') {
            let typeValue = activeColumnProperties['type']
            if (!typeValue) {
              this.setSelectType('any')
            }
          }
          return activeColumnProperties[key]
        }
      }
    },
    setProperty: function(key, value) {
      const hotId = HotRegister.getActiveInstance().guid
      const currentColumnIndex = this.cIndex
      let object = {
        'hotId': hotId,
        'columnIndex': currentColumnIndex,
        'key': key,
        'value': value
      }
      this.pushHotProperty(object)
    },
    currentColumnIndex: function() {
      let currentIndex = getCurrentColumnIndex()
      return currentIndex
    },
    setSelectType: function(value) {
      this.setProperty('type', value)
      this.updateTypeDependentProperties(value)
    },
    updateTypeDependentProperties: function(value) {
      this.constraintValues = this.constraints[value]
      this.updateFormatValues(value)
    },
    updateFormatValues: function(value) {
      this.formatValues = this.formats[value]
    },
    getConstraintValue: function(key) {
      // let object = this.getConstraintsObject
      let object = this.getConstraints
      if (object && object[key]) {
        return object[key]
      }
    },
    setConstraintValue: function(key, value) {
      let object = {}
      object[key] = value
      this.setProperty('constraints', object)
    }
  },
  computed: {
    isDropdownFormatDisabled() {
      return this.formatValues.length < 2
    },
    getConstraints() {
      let type = this.getProperty('type')
      if (type) {
        this.constraintValues = this.constraints[type]
      }
      let property = this.getProperty('constraints')
      if (!property) {
        this.setProperty('constraints', {})
        property = {}
      }
      return property
    },
    selectFormat: {
      get: function() {
        let type = this.getProperty('type')
        if (type) {
          this.updateFormatValues(type)
        }
        let property = this.getProperty('format')
        if (!property) {
          this.setProperty('format', 'default')
          property = 'default'
        }
        return property
      },
      set: function(value) {
        this.setProperty('format', value)
      }
    }
  },
  watch: {
    selectConstraints: function(values) {
      const object = this.constraintBooleanBindings.reduce(
        function(previous, current) {
          if (values.indexOf(current) > -1) {
            return { ...previous, [current]: true }
          } else {
            return previous
          }
        },
        {}
      )
      this.setProperty('constraints', object)
    },
    getConstraints: function(object) {
      this.selectConstraints = Object.keys(object)
    }
  },
  mounted: function() {
    this.$nextTick(function() {
      reselectCurrentCellOrMin()
      this.selectConstraints = Object.keys(this.getConstraints)
    })
  }
}
</script>
<style lang="styl" scoped>
@import '~static/css/columnprops'
</style>
