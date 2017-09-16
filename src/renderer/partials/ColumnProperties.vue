<template>
<form class="navbar-form form-horizontal" id="columnProperties">
  <div class="form-group-sm row container-fluid">
    <div v-for="(formprop, index) in formprops" :key="index">
      <label :style="{paddingLeft: '0'}" class="control-label col-sm-4" :for="formprop.label">{{formprop.label}}:</label>
      <template v-if="typeof formprop.type && formprop.type === 'dropdown'">
          <select v-if="formprop.label === 'type'" :value="getTypeSelected" @input="updateTypeDropdown(formprop.label, $event.target.value)" :id="formprop.label" class="form-control input-sm col-sm-8">
            <option v-for="option in formprop.values" v-bind:value="option">
              {{ option}}
            </option>
          </select>
          <select v-else-if="formprop.label === 'format'" :value="getFormatSelected" @input="setProperty(formprop.label, $event.target.value)" :id="formprop.label" :disabled="isDropdownFormatDisabled" class="form-control input-sm col-sm-8">
            <option v-for="option in formprop.values" v-bind:value="option">
              {{ option}}
            </option>
          </select>
          <select v-else v-model="selectConstraints" multiple :id="formprop.label" class="form-control input-sm col-sm-8">
            <option v-for="option in formprop.values" v-bind:value="option">
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
  getCurrentColumnIndexOrMin as getCurrentColumnIndex
} from '../hot.js'
const Dialog = remote.dialog
export default {
  extends: SideNav,
  name: 'column',
  props: ['getAllColumnsProperties', 'cIndex'],
  data() {
    return {
      foo: '',
      formprops: [{
        label: 'name'
      },
      {
        label: 'title'
      },
      {
        label: 'description'
      },
      // {
      //   label: 'type',
      //   type: 'dropdown',
      //   values: ['string', 'number', 'integer', 'boolean', 'object', 'array', 'date', 'time', 'datetime', 'year', 'yearmonth', 'duration', 'geopoint', 'geojson', 'any']
      // },
      // {
      //   label: 'format',
      //   type: 'dropdown',
      //   values: []
      // },
      // {
      //   label: 'constraints',
      //   type: 'dropdown',
      //   values: []
      // },
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
      'pushHotProperty']),
    getProperty: function(key) {
      let allColumnsProperties = this.getAllColumnsProperties
      if (allColumnsProperties) {
        let activeColumnProperties = allColumnsProperties[this.cIndex]
        if (activeColumnProperties) {
          return activeColumnProperties[key]
        } else {
          this.setProperty(key, '')
        }
      }
    },
    setProperty: function(key, value) {
      console.log(`checking to set...${key}`)
      const hotId = HotRegister.getActiveInstance().guid
      const currentColumnIndex = this.cIndex
      let object = {
        'hotId': hotId,
        'columnIndex': currentColumnIndex,
        'key': key,
        'value': value
      }
      this.pushHotProperty(object)
      // this.postSetColumnHook()
      console.log('returned to set property...')
    },
    updateTypeDropdown: function(key, value) {
      console.log('updating type....')
      this.setProperty('type', value)
      this.updateFormatDropdown(value)
      this.setProperty('format', this.formprops[4].values[0])
      this.updateConstraintsCheckbox(value)
    },
    updateFormatDropdown: function(typeValue) {
      console.log('updating format dropdown....')
      let formatSelection = this.formats[typeValue] || []
      formatSelection.push('default')
      this.formprops[4].values = formatSelection
    },
    updateConstraintsCheckbox: function(typeValue) {
      console.log('updating constraints checkbox....')
      console.log(`type is ${typeValue}`)
      let constraintSelection = this.constraints[typeValue] || []
      this.formprops[5].values = constraintSelection
      console.log(this.formprops[5].values)
    },
    currentColumnIndex: function() {
      console.log('getting column index....')
      let currentIndex = getCurrentColumnIndex()
      console.log(`index: ${currentIndex}`)
      return currentIndex
    }
  },
  computed: {
    ...mapGetters(['getHotColumnProperties']),
    isDropdownFormatDisabled() {
      let found = this.formprops.find(function(obj) {
        return obj.label === 'format'
      })
      return found.values.length < 2
    },
    getTypeSelected() {
      let property = this.getProperty('type')
      console.log(`property selected is: ${property}`)
      console.log(property)
      if (!property) {
        property = this.formprops[3].values[0]
        this.setProperty('type', property)
      }
      this.updateConstraintsCheckbox(property)
      return property
    },
    getFormatSelected() {
      console.log('firing format...')
      let property = this.getProperty('format')
      console.log('format selected is...')
      console.log(property)
      if (!property) {
        let typeSelected = this.getTypeSelected
        this.updateFormatDropdown(typeSelected)
        property = this.formprops[4].values[0]
        this.setProperty('format', property)
      }
      console.log(`format property is ${property}`)
      return property
    },
    selectConstraints: {
      get: function() {
        let property = this.getProperty('constraints')
        console.log('constraints are...')
        console.log(property)
        if (!property) {
          console.log('initialising property')
          this.setProperty('constraints', [])
          property = []
        }
        return property
      },
      set: function(values) {
        console.log('set values for constraints...')
        console.log(values)
        this.setProperty('constraints', values)
        let property = this.getProperty('constraints')
        console.log('constraints are...')
        console.log(property)
      }
    }
  },
  watch: {
    // selectConstraints: function(selectedConstraints) {
    //   console.log(`constraints selected are: ${selectedConstraints}`)
    // }
  },
  // beforeCreate: function() {
  //   console.log('before create')
  // },
  // created: function() {
  //   console.log('created')
  // },
  // beforeMount: function() {
  //   console.log('before mount')
  // },
  mounted: function() {

  }
  // beforeUpdate: function() {
  //   console.log('before update')
  // },
  // updated: function() {
  //   console.log('updated')
  // },
  // activated: function() {
  //   console.log('activated')
  // },
  // deactivated: function() {
  //   console.log('deactivated')
  // },
  // beforeDestroy: function() {
  //   console.log('before destroy')
  // },
  // destroyed: function() {
  //   console.log('destroyed')
  // }
}
</script>
