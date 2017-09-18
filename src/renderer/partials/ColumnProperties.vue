<template>
<form class="navbar-form form-horizontal" id="columnProperties">
  <div class="form-group-sm row container-fluid">
    <div v-for="(formprop, index) in formprops" :key="index">
      <label :style="{paddingLeft: '0'}" class="control-label col-sm-4" :for="formprop.label">{{formprop.label}}:</label>
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
          <select v-else multiple v-model="selectConstraints" id="constraints" :size="constraintValues.length" class="form-control input-sm col-sm-8">
            <option v-for="option in constraintValues" v-bind:value="option">
              {{ option}}
            </option>
          </select>
        </template>
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
      formprops: [{
        label: 'name'
      },
      {
        label: 'title'
      },
      {
        label: 'description'
      },
      {
        label: 'type',
        type: 'dropdown'
      },
      {
        label: 'format',
        type: 'dropdown'
      },
      {
        label: 'constraints',
        type: 'dropdown'
      },
      {
        label: 'rdfType',
        type: 'url'
      }
      ],
      formats: {
        'string': ['email', 'uri', 'binary', 'uuid'],
        'date': ['any', 'pattern'],
        'time': ['any', 'pattern'],
        'datetime': ['any', 'pattern'],
        'geopoint': ['array', 'object'],
        'geojson': ['topojson']
      },
      constraints: {
        'string': ['required', 'unique', 'minLength', 'maxLength', 'pattern', 'enum'],
        'number': ['required', 'unique', 'minLength', 'maxLength', 'minimum', 'maximum', 'enum'],
        'integer': ['required', 'unique', 'minimum', 'maximum', 'enum'],
        'boolean': ['required', 'unique', 'minimum', 'maximum', 'enum'],
        'object': ['required', 'unique', 'minLength', 'maxLength', 'enum'],
        'array': ['required', 'unique', 'minLength', 'maxLength', 'enum'],
        'date': ['required', 'unique', 'minimum', 'maximum', 'enum'],
        'time': ['required', 'unique', 'minimum', 'maximum', 'enum'],
        'datetime': ['required', 'unique', 'minimum', 'maximum', 'enum'],
        'year': ['required', 'unique', 'minimum', 'maximum', 'enum'],
        'yearmonth': ['required', 'unique', 'minimum', 'maximum', 'enum'],
        'duration': ['required', 'unique', 'minimum', 'maximum', 'enum'],
        'geopoint': ['required', 'unique', 'minLength', 'maxLength', 'enum'],
        'geojson': ['required', 'unique', 'minLength', 'maxLength', 'enum'],
        'any': ['required', 'unique', 'minLength', 'maxLength', 'minimum', 'maximum', 'enum']
      },
      otherProperties: ['missingValues', 'primaryKey', 'foreignKey']
    }
  },
  methods: {
    ...mapMutations([
      'pushHotProperty'
    ]),
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
      this.formatValues = this.formats[value] || []
      this.formatValues.push('default')
    }
  },
  computed: {
    ...mapGetters(['getHotColumnProperties']),
    isDropdownFormatDisabled() {
      return this.formatValues.length < 2
    },
    selectConstraints: {
      get: function() {
        let type = this.getProperty('type')
        if (type) {
          this.constraintValues = this.constraints[type]
        }
        let property = this.getProperty('constraints')
        if (!property) {
          this.setProperty('constraints', [])
          property = []
        }
        return property
      },
      set: function(values) {
        this.setProperty('constraints', values)
      }
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
  mounted: function() {
    this.$nextTick(function() {
      reselectCurrentCellOrMin()
    })
  }
}
</script>
