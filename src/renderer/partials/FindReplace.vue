<template>
<form class="navbar-form form-horizontal" id="findAndReplace">
  <div class="form-group-sm row container-fluid">
    <div  class="propertyrow" v-for="(formprop, index) in formprops" :key="index">
      <label v-show="formprop.label" v-tooltip.left="tooltip(formprop.tooltipId)" class="control-label" :for="formprop.label">{{formprop.label}}</label>
      <component :is="formprop.tooltipView"/>
      <div class="inputrow">
        <input type="text" :class="{ 'form-control input-sm col-sm-9': true}" :id="formprop.key" :value="getProperty(formprop.key)" @input="setProperty(formprop.key, $event.target.value)" :name="formprop.key"/>
        <span class="btn-group">
          <button type="button" class="btn btn-sm" :class="formprop.buttonTypeClass || 'btn-default'">
            <span v-if="formprop.buttonClass" :class="formprop.buttonClass"/>
            <template v-if="formprop.buttonText">
              {{formprop.buttonText}}
            </template>
          </button>
          <button v-show="formprop.buttonRight" type="button" class="btn btn-sm" :class="formprop.buttonTypeClass || 'btn-default'">
            <span class="fa fa-chevron-right"/>
          </button>
        </span>
      </div>
      <span v-if="formprop.buttonBelowText" class="btn-group">
        <button type="button" class="button-below btn btn-sm" :class="formprop.buttonTypeClass || 'btn-default'" >
          <span>{{formprop.buttonBelowText}}</span>
        </button>
      </span>
    </div>
    <div class="pickrow">
      <template v-for="(radioprop, index) in radioprops">
        <input type="radio" :id="radioprop.key" :value="radioprop.value" v-model="findTypePicked">
        <label for="find-in-column">{{radioprop.label}}</label>
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
      findTypePicked: 'findInTable',
      formprops: [{
        label: 'Find',
        key: 'find',
        buttonTypeClass: 'btn-primary',
        buttonClass: 'fa fa-chevron-left',
        buttonRight: true
      }, {
        label: 'Replace',
        key: 'replace',
        buttonText: 'Replace',
        buttonTypeClass: 'btn-primary',
        buttonBelowText: 'Replace All'
      }],
      radioprops: [{
        label: 'in Column',
        key: 'find-in-column',
        value: 'findInColumn'
      }, {
        label: 'in Table',
        key: 'find-in-table',
        value: 'findInTable'
      }]
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
