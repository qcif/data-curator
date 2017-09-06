<template>
<form class="navbar-form form-horizontal" id="columnProperties">
  <div class="form-group-sm row container-fluid">
    <!-- <template v-if="hotId && currentColumnIndex" > -->
      <div v-for="(formprop, index) in formprops" :key="index">
        <label :style="{paddingLeft: '0'}" class="control-label col-sm-4" :for="formprop.label">{{formprop.label}}:</label>
        <template v-if="typeof formprop.type && formprop.type === 'dropdown'">
          <select v-if="formprop.label === 'type'" :value="getTypeSelected" @input="updateTypeDropdown(formprop.label, $event.target.value)" :id="formprop.label" class="form-control input-sm col-sm-8">
            <option v-for="option in formprop.dropdown" v-bind:value="option">
              {{ option}}
            </option>
          </select>
          <select v-else :value="getFormatSelected" @input="setProperty(formprop.label, $event.target.value)" :id="formprop.label" :disabled="isFormatDisabled" class="form-control input-sm col-sm-8">
            <option v-for="option in formprop.dropdown" v-bind:value="option">
              {{ option}}
            </option>
          </select>
        </template>
        <input v-else :value="getProperty(formprop.label)" @input="setProperty(formprop.label, $event.target.value)" type="text" class="form-control input-sm col-sm-8" :id="formprop.label" />
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
  mapState,
  mapGetters
} from 'vuex'
import {
  remote
} from 'electron'
import SideNav from './SideNav'
import {
  HotRegister,
  getCurrentColumnIndex
} from '../hot.js'
const Dialog = remote.dialog
export default {
  extends: SideNav,
  name: 'column',
  data() {
    return {
      ...mapState([
        'hotTabs'
      ]),
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
        type: 'dropdown',
        dropdown: ['string', 'number', 'integer', 'boolean', 'object', 'array', 'date', 'time', 'datetime', 'year', 'yearmonth', 'duration', 'geopoint', 'geojson', 'any']
      },
      {
        label: 'format',
        type: 'dropdown',
        dropdown: []
      },
      {
        label: 'rdfType',
        type: 'url'
      },
      {
        label: 'constraints',
        type: 'json'
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
      constraints: ['required', 'unique', 'minLength', 'maxLength', 'minimum', 'maximum', 'pattern', 'enum'],
      otherProperties: ['missingValues', 'primaryKey', 'foreignKey']
    }
  },
  methods: {
    ...mapMutations([
      'pushHotProperty'
    ]),
    showErrorMessage(object) {
      Dialog.showMessageBox(Object.assign({
        type: 'error',
        buttons: ['OK'],
        title: 'Error finding column properties'
      }, object))
    },
    getColumnProperties() {
      console.log('checking column...')
      const hotId = this.hotId()
      const currentColumnIndex = this.currentColumnIndex()
      // if (hotId && currentColumnIndex) {
      // console.log('have hot id and column index...')
      let columnProperties = this.columnProps(hotId)
      if (columnProperties) {
        return columnProperties[currentColumnIndex]
      }
      // }
    },
    getProperty: function(key) {
      let columnProperties = this.getColumnProperties()
      let columnProperty = columnProperties ? columnProperties[key] : ''
      console.log(`returning ${columnProperty} for ${key}`)
      return columnProperty
    },
    setProperty: function(key, value) {
      console.log(`checking to set...${key}`)
      const hotId = this.hotId()
      const currentColumnIndex = this.currentColumnIndex()
      // if (hotId && currentColumnIndex) {
      console.log('returned from current column index...')
      let object = {
        'hotId': hotId,
        'columnIndex': currentColumnIndex,
        'key': key,
        'value': value
      }
      console.log('object is....')
      console.log(object)
      this.pushHotProperty(object)
      // }
    },
    updateTypeDropdown: function(key, value) {
      console.log('updating type....')
      this.setProperty('type', value)
      this.updateFormatDropdown(value)
      this.setProperty('format', this.formprops[4].dropdown[0])
    },
    updateFormatDropdown: function(typeValue) {
      console.log('updating format dropdown....')
      let formatSelection = this.formats[typeValue] || []
      formatSelection.push('default')
      this.formprops[4].dropdown = formatSelection
    },
    // updateFormatSelected: function(value) {
    //   this.setProperty('format', value)
    //   console.log('format selection has been updated.')
    // },
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
  },
  computed: {
    ...mapGetters({
      columnProps: 'getHotColumnProperties'
    }),
    isFormatDisabled() {
      let found = this.formprops.find(function(obj) {
        return obj.label === 'format'
      })
      return found.dropdown.length < 2
    },
    getTypeSelected() {
      let property = this.getProperty('type')
      if (!property) {
        property = this.formprops[3].dropdown[0]
        this.setProperty('type', property)
      }
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
        property = this.formprops[4].dropdown[0]
        this.setProperty('format', property)
      }
      console.log(`format property is ${property}`)
      return property
    }
  },
  watch: {
  },
  mounted: function() {
    this.$nextTick(function() {
    })
  }
}
</script>
