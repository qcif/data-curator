<template>
<form class="navbar-form form-horizontal" id="tableProperties">
  <div class="form-group-sm row container-fluid">
    <div class="propertyrow" v-for="(formprop, index) in formprops" :key="index">
      <template v-if="formprop.type !== 'hidden'">
        <label class="control-label col-sm-3" :for="formprop.label">{{formprop.label}}:</label>
        <input v-if="formprop.label === 'missing values'" :value="missingValues" @input="setMissingValues($event.target.value)" type="text" class="form-control input-sm col-sm-9" :id="formprop.label" />
        <input v-else-if="formprop.type === 'primary key(s)'" :value="primaryKeys" @input="setArrayValues(formprop.key, $event.target.value)" type="text" class="form-control input-sm col-sm-9" :id="formprop.label" />
        <!-- <input v-else-if="formprop.type === 'foreign key(s)'" :value="foreignKeys" @input="setArrayValues(formprop.key, $event.target.value)" type="text" class="form-control input-sm col-sm-9" :id="formprop.label" /> -->
        <component v-else-if="isSharedComponent(formprop.label)" :getProperty="getProperty" :getPropertyGivenHotId="getPropertyGivenHotId" :setProperty="setProperty" :waitForHotIdFromTabId="waitForHotIdFromTabId" :is="formprop.label"/>
        <input v-else type="text" class="form-control input-sm col-sm-9" :id="formprop.label" :value="getProperty(formprop.label)" @input="setProperty(formprop.label, $event.target.value)"/>
      </template>
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
Vue.use(AsyncComputed)
export default {
  extends: SideNav,
  name: 'tabular',
  components: {
    licenses,
    sources
  },
  data() {
    return {
      formprops: [{
        label: 'title'
      },
      {
        label: 'name'
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
        label: 'description'
      },
      // do we need sources for a table?
      // so add this as a row model with a plus/minus and leave each entry as text boxes for people to edit
      {
        label: 'sources',
        type: 'dropdown'
      },
      {
        label: 'licenses'
      },
      {
        label: 'format',
        type: 'hidden',
        value: 'csv'
      },
      // value is set at datapackage creation when it also prompts if filenames not saved yet
      {
        label: 'path',
        type: 'hidden',
        value: ''
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
        type: 'array'
      }
      ]
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
    ...mapGetters(['getMissingValuesFromHot', 'getActiveTab', 'getTableProperty'])
  },
  methods: {
    ...mapMutations([
      'pushTableSchemaDescriptorProperty', 'pushTableProperty'
    ]),
    getArrayValues: async function(key) {
      let tabId = this.getActiveTab
      let values = await this.getArrayValuesFromTabId(key, tabId)
      // ensure re-render in input
      this.$forceUpdate()
      return values
    },
    setArrayValues: function(key, value) {
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
        let array = this.getTableProperty({hotId: hotId, key: key}) || ['']
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
    }
  },
  watch: {
  },
  beforeCreate: function() {
    this.$nextTick(function() {
      // set hidden inputs
      let found = this.formprops.forEach(x => {
        if (x.type ==='hidden') {
          this.setProperty(x.label, x.value)
        }
      })
    })
  }
}
</script>
