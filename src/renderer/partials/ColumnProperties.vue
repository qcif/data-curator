<template>
<form class="navbar-form form-horizontal" id="columnProperties">
  <div class="form-group-sm row container-fluid">
    <!-- <template v-if="hotId && currentColumnIndex" > -->
      <div v-for="(formprop, index) in formprops" :key="index">
        <label :style="{paddingLeft: '0'}" class="control-label col-sm-4" :for="formprop.label">{{formprop.label}}:</label>
        <template v-if="typeof formprop.type && formprop.type === 'dropdown'">
          <select v-if="formprop.label === 'type'" v-model="selectedType" class="form-control input-sm col-sm-8">
            <option v-for="option in formprop.dropdown" v-bind:value="option">
              {{ option}}
            </option>
          </select>
          <select v-else v-model="formprop.value" :disabled="isFormatDisabled" class="form-control input-sm col-sm-8">
            <option v-for="option in formprop.dropdown" v-bind:value="option">
              {{ option}}
            </option>
          </select>
        </template>
        <input v-else :value="getProperty(formprop.label)" @input="value => {setPropertyValue(formprop.label, value) }" type="text" class="form-control input-sm col-sm-8" :id="formprop.label" />
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
      selectedFormat: '',
      formprops: [{
        label: 'name',
        value: ''
      },
      {
        label: 'title',
        value: ''
      },
      {
        label: 'description',
        value: ''
      },
      {
        label: 'type',
        type: 'dropdown',
        dropdown: ['string', 'number', 'integer', 'boolean', 'object', 'array', 'date', 'time', 'datetime', 'year', 'yearmonth', 'duration', 'geopoint', 'geojson', 'any'],
        default: 'string',
        value: 'string'
      },
      {
        label: 'format',
        type: 'dropdown',
        dropdown: [],
        value: ''
      },
      {
        label: 'rdfType',
        type: 'url',
        value: ''
      },
      {
        label: 'contraints',
        type: 'json',
        value: ''
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
      if (hotId && currentColumnIndex) {
        let columnProperties = this.columnProps(hotId, currentColumnIndex)
        if (!columnProperties) {
          this.showErrorMessage({
            message: 'No column properties found.',
            detail: 'Did you `Guess column properties` first?'
          })
        } else {
          return columnProperties[hotColumnIndex]
        }
      }
    },
    getProperty: function(key) {
      console.log('checking...')
      let columnProperty = this.getColumnProperties()
      return columnProperty[key]
    },
    setProperty: function(key, value) {
      console.log('checking...')
      const hotId = this.hotId()
      const currentColumnIndex = this.currentColumnIndex()
      if (hotId && currentColumnIndex) {
        let columnProperties = this.columnProps(hotId, currentColumnIndex)
        if (!columnProperties) {
          this.showErrorMessage({
            message: 'No column properties found.',
            detail: 'Did you `Guess column properties` first?'
          })
        } else {
          this.pushHotProperty({
            'hotId': hotId,
            'columnIndex': currentColumnIndex,
            'key': key,
            'value': value
          })
        }
      }
    },
    hotId: function() {
      console.log('getting hot id....')
      return HotRegister.getActiveInstance().guid
    },
    currentColumnIndex: function() {
      console.log('getting column index....')
      return getCurrentColumnIndex()
    }
    // getColumnProperties(hotId, hotColumnIndex) {
    //   let columnProperties = this.columnProps(hotId)
    //   if (!columnProperties) {
    //     this.showErrorMessage({
    //       message: 'No column properties found.',
    //       detail: 'Did you `Guess column properties` first?'
    //     })
    //   } else {
    //     return columnProperties[hotColumnIndex]
    //   }
    // },
    // populateColumnProperties(columnProperties) {
    //   let nameObject = this.formprops.find(formprop => formprop.label === 'name')
    //   nameObject.value = columnProperties.name
    // },
    // showCurrentColumnProperties() {
    //   let hotId = HotRegister.getActiveInstance().guid
    //   let hotColumnIndex = getCurrentColumn()
    //   if (hotId && hotColumnIndex) {
    //     let columnProperties = this.getColumnProperties(hotId, hotColumnIndex)
    //     console.log('column properties...')
    //     console.log(columnProperties)
    //     // this.populateColumnProperties(columnProperties)
    //     return columnProperties
    //   // } else {
    //   //   this.showErrorMessage({
    //   //     message: 'No selection found in the active table.',
    //   //     detail: 'Please check that you have 1 column or cell selected.'
    //   //   })
    //   }
    // }
    // getPropertyValue(key) {
    //   console.log('key is...')
    //   console.log(key)
    //   let properties = this.showCurrentColumnProperties()
    //   console.log(properties)
    //   return properties[key]
    // }
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
    selectedType: {
      get: function() {
        return this.formprops[3].value
      },
      set: function(selection) {
        this.formprops[3].value = selection
        let formatSelection = this.formats[selection] || []
        formatSelection.push('default')
        this.formprops[4].dropdown = formatSelection
        this.formprops[4].value = formatSelection[0]
      }
    },
    propertyValue: {
      get: function(key) {

        // return this.formprops[3].value
      },
      set: function(key, value) {
        console.log('key is to set...')
        console.log(key)
        console.log('value is to set...')
        console.log(value)
        let properties = this.showCurrentColumnProperties()
        properties[key] = value
      }
    }
  },
  watch: {
    hotTabs: function(newHotTabs) {
      console.log('hot tabs changed!!!')
    }
  },
  mounted: function() {
    this.$nextTick(function() {
      // this.showCurrentColumnProperties()
    })
  }
}
</script>
