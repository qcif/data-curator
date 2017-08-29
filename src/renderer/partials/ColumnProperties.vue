<template>
<form class="navbar-form form-horizontal" id="columnProperties">
  <div class="form-group-sm row container-fluid">
    <div v-for="(formprop, index) in formprops" :key="index">
      <label :style="{paddingLeft: '0'}" class="control-label col-sm-4" :for="formprop.label">{{formprop.label}}:</label>
      <template v-if="typeof formprop.type && formprop.type === 'dropdown'">
        <select v-if="formprop.label === 'type'" v-model="selectedType" class="form-control input-sm col-sm-8">
          <option v-for="option in formprop.dropdown" v-bind:value="option">
            {{ option}}
          </option>
        </select>
        <select v-else v-model="selectedFormat" :disabled="isFormatDisabled" class="form-control input-sm col-sm-8">
          <option v-for="option in formprop.dropdown" v-bind:value="option">
            {{ option}}
          </option>
        </select>
      </template>
      <input v-else type="text" class="form-control input-sm col-sm-8" :id="formprop.label" />
    </div>
  </div>
</form>
</template>
<script>
import SideNav from './SideNav'
export default {
  extends: SideNav,
  name: 'column',
  data() {
    return {
      selectedType: 'string',
      selectedFormat: '',
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
        dropdown: ['string', 'number', 'integer', 'boolean', 'object', 'array', 'date', 'time', 'datetime', 'year', 'yearmonth', 'duration', 'geopoint', 'geojson', 'any'],
        default: 'string'
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
        label: 'contraints',
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
  },
  computed: {
    isFormatDisabled() {
      let found = this.formprops.find(function(obj) { return obj.label === 'format' })
      return found.dropdown.length < 2
    }
  },
  watch: {
    selectedType: function (selection) {
      let formatSelection = this.formats[selection] || []
      formatSelection.push('default')
      _.set(this.formprops, '4[dropdown]', formatSelection)
      this.selectedFormat = _.head(formatSelection)
    }
  }
}
</script>
