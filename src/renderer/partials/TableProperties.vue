<template>
<form class="navbar-form form-horizontal" id="tableProperties">
  <div class="form-group-sm row container-fluid">
    <div class="propertyrow" v-for="(formprop, index) in formprops" :key="index">
      <template v-if="formprop.type !== 'hidden'">
        <label class="control-label col-sm-3" :for="formprop.label">{{formprop.label}}:</label>
        <!-- until all labels have input only setup get/set for explicity set type-->
        <input v-if="formprop.label === 'missing values'" :value="missingValues" @input="setMissingValues($event.target.value)" type="text" class="form-control input-sm col-sm-9" :id="formprop.label" />
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
        label: 'missing values'
      }
      ]
    }
  },
  asyncComputed: {
    async missingValues() {
      let tabId = this.getActiveTab
      let missingValues = await this.getMissingValuesFromTabId(tabId)
      // ensure re-render in input
      this.$forceUpdate()
      return missingValues
    }
  },
  computed: {
    ...mapGetters(['getMissingValuesFromHot', 'getActiveTab', 'getTableProperty'])
  },
  methods: {
    ...mapMutations([
      'pushMissingValues', 'pushTableProperty'
    ]),
    setMissingValues: function(value) {
      let hot = HotRegister.getActiveInstance()
      if (hot) {
        let array = Array.from(new Set(value.split(',')))
        this.pushMissingValues({
          hotId: hot.guid,
          missingValues: array
        })
      }
    },
    getMissingValuesFromTabId: async function(tabId) {
      let hotId = await this.waitForHotIdFromTabId(tabId)
      if (hotId) {
        let array = this.getMissingValuesFromHot(hotId) || ['']
        let string = array.join()
        return string
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
