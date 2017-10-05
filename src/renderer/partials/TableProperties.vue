<template>
<form class="navbar-form form-horizontal" id="tableProperties">
  <div class="form-group-sm row container-fluid">
    <div v-for="(formprop, index) in formprops" :key="index">
      <label :style="{paddingLeft: '0'}" class="control-label col-sm-4" :for="formprop.label">{{formprop.label}}:</label>
      <!-- until all labels have input only setup get/set for explicity set type-->
      <input v-if="formprop.type === 'text'" :value="missingValues" @input="setMissingValues($event.target.value)" type="text" class="form-control input-sm col-sm-8" :id="formprop.label" />
      <input v-else type="text" class="form-control input-sm col-sm-8" :id="formprop.label" />
    </div>
  </div>
</form>
</template>
<script>
import SideNav from './SideNav'
import {
  mapMutations,
  mapState,
  mapGetters
} from 'vuex'
import {
  HotRegister
} from '../hot.js'
import Vue from 'vue'
import AsyncComputed from 'vue-async-computed'
Vue.use(AsyncComputed)
export default {
  extends: SideNav,
  name: 'tabular',
  data() {
    return {
      formprops: [{
        label: 'title'
      },
      {
        label: 'name'
      },
      {
        label: 'profile'
      },
      {
        label: 'description'
      },
      {
        label: 'sources',
        type: 'dropdown'
      },
      {
        label: 'licences',
        type: 'dropdown'
      },
      {
        label: 'format'
      },
      {
        label: 'mediatype'
      },
      {
        label: 'encoding'
      },
      {
        label: 'missing values',
        type: 'text'
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
    ...mapGetters(['getMissingValuesFromHot', 'getActiveTab', 'getHotIdFromTabId'])
  },
  methods: {
    ...mapMutations([
      'pushMissingValues'
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
      try {
        let hotId = await this.getHotIdFromTabId(tabId)
        if (hotId) {
          let array = this.getMissingValuesFromHot(hotId) || ['']
          let string = array.join()
          return string
        }
      } catch (err) {
        if (err) {
          console.log('Problem with promise')
          console.log(err)
        }
      }
    }
  }
}
</script>
