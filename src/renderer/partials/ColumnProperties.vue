<template>
<form class="navbar-form form-horizontal" id="columnProperties">
  <div class="form-group-sm row container-fluid">
    <!-- <template v-if="hotId && currentColumnIndex" > -->
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
      <!-- <div v-else-if="typeof formprop.type && formprop.type === 'checkbox'">
        <template v-for="constraint in getTypeConstraints">
          <input type="checkbox" :id="constraint" :value="constraint" v-model="selectConstraints" />
          <label :for="constraint">{{constraint}}</label>
        </template>
      </div> -->
      <input v-else :value="getPropert(formprop.label)" @input="setProperty(formprop.label, $event.target.value)" type="text" class="form-control input-sm col-sm-8" :id="formprop.label" />
    </div>
    <!-- </template> -->
    <!-- <div v-else>
      Select a column
    </div> -->
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
  props: ['whenApplied'],
  data() {
    return {
      formprops: [{
        label: 'name'
      }
      // {
      //   label: 'title'
      // },
      // {
      //   label: 'description'
      // },
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
      // {
      //   label: 'rdfType',
      //   type: 'url'
      // }
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
    // showErrorMessage(object) {
    //   Dialog.showMessageBox(Object.assign({
    //     type: 'error',
    //     buttons: ['OK'],
    //     title: 'Error finding column properties'
    //   }, object))
    // },
    getPropert: function(key) {
      // console.log(`entered get property for ${key}...`)
      // // console.log(this.hotTabs)
      // // let columnProperties = this.getColumnProperties()
      // let allColumnProperties = this.getHotColumnProperties(this.hotId())
      // let activeColumnProperties
      // if (allColumnProperties) {
      //   let currentIndex = this.whenApplied()
      //   activeColumnProperties = allColumnProperties[currentIndex]
      // }
      // console.log('have column properties...')
      // console.log(activeColumnProperties)
      // columnProperties[this.currentColumnIndex]
      // let columnProperty = ''
      // if (!activeColumnProperties) {
      //   this.setProperty(key, columnProperty)
      // } else {
      //   columnProperty = activeColumnProperties[key]
      // }
      // console.log(`returning ${columnProperty} for ${key}`)
      // return activeColumnProperties ? activeColumnProperties[key] : ''
      // return this.whenApplied()
      console.log('getting property again ok')
      let activeColumnProperties = this.whenApplied(key)
      return activeColumnProperties ? activeColumnProperties[key] : ''
    },
    setProperty: function(key, value) {
      // console.log(`checking to set...${key}`)
      const hotId = this.hotId()
      // console.log(`hot id is: ${hotId}`)
      const currentColumnIndex = this.currentColumnIndex()
      // console.log(`currentColumnIndex is: ${currentColumnIndex}`)
      // console.log('returned from current column index...')
      let object = {
        'hotId': hotId,
        'columnIndex': currentColumnIndex,
        'key': key,
        'value': value
      }
      // console.log('object is....')
      // console.log(object)
      this.pushHotProperty(object)
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
    hotId: function() {
      console.log('getting hot id....')
      return HotRegister.getActiveInstance().guid
    },
    currentColumnIndex: function() {
      console.log('getting column index....')
      let currentIndex = getCurrentColumnIndex()
      console.log(`index: ${currentIndex}`)
      return currentIndex
    }
    // getColumnProperties: function() {
    //   console.log('checking column...')
    //   let columnProperties = this.getHotColumnProperties(this.hotId())
    //   console.log(columnProperties)
    //   if (columnProperties) {
    //     return columnProperties[this.currentColumnIndex]
    //   }
    // }
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
    // testTriggering() {
    //   return this.activeColumnIndex
    // }
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
    console.log('mounted')
    // this.whenApplied()
    this.$nextTick(function() {
      console.log('ticking')
    })
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
