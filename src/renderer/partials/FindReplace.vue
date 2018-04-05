<template>
<form class="navbar-form form-horizontal" id="findAndReplace">
  <div class="form-group-sm row container-fluid">
    <div class="propertyrow">
      <template v-for="(formprop, index) in formprops">
        <label v-show="formprop.label" v-tooltip.left="tooltip(formprop.tooltipId)" class="control-label" :for="formprop.label">{{formprop.label}}</label>
        <component :is="formprop.tooltipView"/>
        <input type="text" :class="{ 'form-control input-sm col-sm-9': true}" :id="formprop.key" :value="getProperty(formprop.key)" @input="setProperty(formprop.key, $event.target.value)" :name="formprop.key"/>
      </template>
    </div>
    <span class="find btn-group">
      <button type="button" class="btn btn-default btn-sm" >
        <span class="fa fa-chevron-left"/>
      </button>
      <button type="button" class="btn btn-default btn-sm" >
        <span class="fa fa-chevron-right"/>
      </button>
    </span>
    <div class="replace btn-group">
      <button type="button" class="btn btn-default btn-sm" >
        Replace All
      </button>
      <button type="button" class="replace-all btn btn-default btn-sm" >
        Replace
      </button>
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
import {
  HotRegister
} from '../hot.js'
// import TableTooltip from '../mixins/TableTooltip'
// import ValidationRules from '../mixins/ValidationRules'
// import {
//   Validator
// } from 'vee-validate'
Vue.use(AsyncComputed)
export default {
  extends: SideNav,
  name: 'findReplace',
  // mixins: [ValidationRules, TableTooltip],
  components: {
  },
  data() {
    return {
      formprops: [{
        label: 'Find',
        key: 'find'
        // tooltipId: 'tooltip-table-name',
        // tooltipView: 'tooltipTableName'
      }, {
        label: 'Replace',
        key: 'replace'
        // tooltipId: 'tooltip-table-title',
        // tooltipView: 'tooltipTableTitle'
      }
      ]
    }
  },
  asyncComputed: {
    // async missingValues() {
    //   let values = await this.getArrayValues('missingValues')
    //   return values
    // }
  },
  computed: {
    ...mapGetters(['getActiveTab', 'getHotTabs'])
  },
  methods: {
    // ...mapMutations([
    //   'pushTableProperty'
    // ]),
    getProperty: function(key) {
      // return this.getTableProperty(this.propertyGetObject(key))
    },
    getPropertyGivenHotId: function(key, hotId) {
      // return this.getTableProperty(this.propertyGetObjectGivenHotId(key, hotId))
    },
    setProperty: function(key, value) {
      // this.pushTableProperty(this.propertySetObject(key, value))
    },
    removeValue: function(key) {
      // this.pushTableProperty(this.propertySetObject(key, ''))
      return true
    }
  },
  mounted: function() {
  }
}
</script>
<style lang="styl" scoped>
@import '~static/css/findreplace'
</style>
