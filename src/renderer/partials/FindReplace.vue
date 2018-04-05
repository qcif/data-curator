<template>
<form class="navbar-form form-horizontal" id="findAndReplace">
  <div class="form-group-sm row container-fluid">
    <div  class="propertyrow" v-for="(formprop, index) in formprops" :key="index">
      <label v-show="formprop.label" v-tooltip.left="tooltip(formprop.tooltipId)" class="control-label" :for="formprop.label">{{formprop.label}}</label>
      <component :is="formprop.tooltipView"/>
      <div class="inputrow">
        <input type="text" :class="{ 'form-control input-sm col-sm-9': true}" :id="formprop.key" :value="getProperty(formprop.key)" @input="setProperty(formprop.key, $event.target.value)" :name="formprop.key"/>
        <span class="btn-group">
          <button type="button" class="btn btn-default btn-sm" >
            <span v-if="formprop.buttonClass" :class="formprop.buttonClass"/>
            <template v-if="formprop.buttonText">
              {{formprop.buttonText}}
            </template>
          </button>
          <button v-show="formprop.label === 'Find'" type="button" class="btn btn-default btn-sm" >
            <span class="fa fa-chevron-right"/>
          </button>
        </span>
      </div>
      <span v-if="formprop.buttonExtra" class="btn-group">
        <button type="button" class="button-extra btn btn-default btn-sm" >
          <span>{{formprop.buttonExtra}}</span>
        </button>
      </span>
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
        key: 'find',
        buttonClass: 'fa fa-chevron-left'
        // tooltipId: 'tooltip-table-name',
        // tooltipView: 'tooltipTableName'
      }, {
        label: 'Replace',
        key: 'replace',
        buttonText: 'Replace',
        buttonExtra: 'Replace All'
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
