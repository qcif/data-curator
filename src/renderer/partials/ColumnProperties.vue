<template>
<form class="navbar-form form-horizontal" id="columnProperties">
  <div class="form-group-sm row container-fluid">
    <div v-for="(formprop, index) in formprops" :key="index">
      <label :style="{paddingLeft: '0'}" class="control-label col-sm-4" :for="formprop.label">{{formprop.label}}:</label>
      <template v-if="typeof formprop.type && formprop.type === 'dropdown'">
          <select v-if="formprop.label==='type'" v-model="selectType" :id="formprop.label" class="form-control input-sm col-sm-8">
            <option v-for="option in typeValues" v-bind:value="option">
              {{ option}}
            </option>
          </select>
          <!-- <select v-else-if="formprop.label==='format'" v-model="selectFormat" id="format" class="form-control input-sm col-sm-8">
            <option v-for="option in formatValues" v-bind:value="option">
              {{ option}}
            </option>
          </select> -->
          <select v-else v-model="selectConstraints" multiple id="constraints" :size="constraintValues.length" class="form-control input-sm col-sm-8">
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
  getCurrentColumnIndexOrMin as getCurrentColumnIndex
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
      // {
      //   label: 'format',
      //   type: 'dropdown'
      // },
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
    // updateFormatDropdown: function(typeValue) {
    //   console.log(`type value is: ${typeValue}`)
    //   this.formatValues = this.formats[typeValue] || []
    //   this.formatValues.push('default')
    //   console.log(`selected format: ${this.formatValues}`)
    //   // this.formatValues.push('default')
    //   console.log(this.formatValues[0])
    //   this.selectFormat = this.formatValues[0]
    // },
    updateConstraintsDropdown: function(typeValue) {
      this.constraintValues = this.constraints[typeValue] || []
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
    // isDropdownFormatDisabled() {
    //   let found = this.formprops.find(function(obj) {
    //     return obj.label === 'format'
    //   })
    //   return found.values.length < 2
    // },
    // getFormatSelected() {
    //   console.log('firing format...')
    //   let property = this.getProperty('format')
    //   console.log('format selected is...')
    //   console.log(property)
    //   if (!property) {
    //     let typeSelected = this.getTypeSelected
    //     this.updateFormatDropdown(typeSelected)
    //     property = this.formprops[4].values[0]
    //     this.setProperty('format', property)
    //   }
    //   console.log(`format property is ${property}`)
    //   return property
    // },
    selectType: {
      get: function() {
        let property = this.getProperty('type')
        console.log('type is...')
        console.log(property)
        if (!property) {
          console.log('initialising property')
          property = this.typeValues[0]
          console.log(`property is now ${property}`)
          this.setProperty('type', property)
        }
        // this.updateFormatDropdown(property)
        this.updateConstraintsDropdown(property)
        return property
      },
      set: function(value) {
        console.log('set values for type...')
        console.log(value)
        this.setProperty('type', value)
        // this.updateFormatDropdown(value)
        this.updateConstraintsDropdown(value)
      }
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
      }
    }
    // selectFormat: {
    //   get: function() {
    //     let property = this.getProperty('format')
    //     console.log('formats are...')
    //     console.log(property)
    //     if (!property) {
    //       console.log('initialising property')
    //       this.setProperty('format', [])
    //       property = []
    //     }
    //     return property
    //   },
    //   set: function(value) {
    //     console.log('set value for format...')
    //     console.log(value)
    //     this.setProperty('format', value)
    //   }
    // }
    // updateTypeDropdown: function(key, value) {
    //   console.log('updating type....')
    //   this.setProperty('type', value)
    //   // this.updateFormatDropdown(value)
    //   // this.setProperty('format', this.formprops[4].values[0])
    //   this.updateConstraintsCheckbox(value)
    // },
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
