<template>
<form class="navbar-form form-horizontal" id="findAndReplace">
  <div class="form-group-sm row container-fluid">
    <div  class="propertyrow" v-for="(formprop, index) in formprops" :key="index">
      <label v-show="formprop.label" v-tooltip.left="tooltip(formprop.tooltipId)" class="control-label" :for="formprop.label">{{formprop.label}}</label>
      <component :is="formprop.tooltipView"/>
      <div class="inputrow">
        <input type="text" :class="{ 'form-control input-sm col-sm-9': true}" :id="formprop.key" :value="getText(formprop.key)" @input="setText(formprop.key, $event.target.value)" :name="formprop.key"/>
        <span class="btn-group">
          <button type="button" class="btn btn-sm" :class="formprop.buttonTypeClass || 'btn-default'" @click="formprop.fn('previous')">
            <span v-if="formprop.buttonLeftClass" :class="formprop.buttonLeftClass"/>
            <template v-if="formprop.buttonLeftText">
              {{formprop.buttonLeftText}}
            </template>
          </button>
          <button v-show="formprop.buttonRightClass" type="button" class="btn btn-sm" :class="formprop.buttonTypeClass || 'btn-default'" @click="formprop.fn('next')">
            <span :class="formprop.buttonRightClass"/>
          </button>
        </span>
      </div>
      <span v-if="formprop.buttonBelowText" class="btn-group">
        <button type="button" class="button-below btn btn-sm" :class="formprop.buttonTypeClass || 'btn-default'" @click="formprop.fn('next')">
          <span>{{formprop.buttonBelowText}}</span>
        </button>
      </span>
    </div>
    <div class="pickrow">
      <span v-for="(radioprop, index) in radioprops">
        <input type="radio" :id="radioprop.key" :value="radioprop.value" v-model="findTypePicked">
        <label for="find-in-column">{{radioprop.label}}</label>
      </span>
    </div>
  </div>
  <div id="searchCounter">
    {{getCount}}
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
  HotRegister,
  searchCallback
} from '../hot.js'
import {
  searchCounter$
} from '@/rxSubject.js'
// import TableTooltip from '../mixins/TableTooltip'
// import ValidationRules from '../mixins/ValidationRules'
// import {
//   Validator
// } from 'vee-validate'
Vue.use(AsyncComputed)
let _searchAction = function() {}
const _searchCallback = function(instance, row, col, value, result) {
  console.log('search callback')
  searchCallback.apply(this, arguments)
  if (result) {
    _searchAction(instance.guid)
  }
}
export default {
  extends: SideNav,
  name: 'findReplace',
  // mixins: [ValidationRules, TableTooltip],
  components: {
  },
  data() {
    return {
      hotId: null,
      findTypePicked: 'findInTable',
      findTextValue: '',
      replaceTextValue: '',
      getCount: 0,
      foundStyle: {
        backgroundColor: 'rgba(70, 237, 70, 0.3)'
      },
      hotParameters: {
        searchResultClass: 'search-result-hot',
        callback: _searchCallback
      },
      formprops: [{
        label: 'Find',
        key: 'find',
        buttonTypeClass: 'btn-primary',
        buttonLeftClass: 'fa fa-chevron-left',
        buttonRightClass: 'fa fa-chevron-right',
        textModel: this.findTextValue,
        fn: this.findText
      }, {
        label: 'Replace',
        key: 'replace',
        buttonTypeClass: 'btn-primary',
        buttonLeftText: 'Replace',
        buttonBelowText: 'Replace All',
        textModel: this.replaceTextValue,
        fn: this.replaceText
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
  // asyncComputed: {
  //   getCount: {
  //     async get() {
  //       console.log('getting')
  //       return this.getLatestSearchResult(this.hotId)
  //     }
  //   }
  // },
  computed: {
    ...mapGetters(['getLatestSearchResult'])
  },
  methods: {
    ...mapMutations([
      'resetSearchResult', 'incrementSearchResult'
    ]),
    getText: function(key) {
      return key === 'find' ? this.findTextValue : this.replaceTextValue
    },
    setText: function(key, value) {
      if (key === 'find') {
        this.findTextValue = value
      } else {
        this.replaceTextValue = value
      }
    },
    findText: function(direction) {
      let hot = HotRegister.getActiveInstance()
      this.hotId = hot.guid
      this.resetSearchResult(this.hotId)
      hot.search.query(this.findTextValue)
      // render will add the search class to all relevant cells
      hot.render()
      // update search class style
      this.updateFoundStyle()
    },
    replaceText: function(direction) {
      console.log(this.findTypePicked)
      console.log(direction)
      console.log(this.findTextValue)
      console.log(this.replaceTextValue)
    },
    updateFoundStyle: function() {
      const style = this.foundStyle
      document.querySelectorAll('.search-result-hot').forEach(function(el) {
        for (const property of _.keys(style)) {
          el.style[property] = style[property]
        }
      })
    },
    incrementSearchResultWrapper: function() {
      this.incrementSearchResult(this.hotId)
      this.getCount = this.getLatestSearchResult(this.hotId)
      // searchCounter$.next(this.getLatestSearchResult)
    }
    // updateLatestCounter: function() {
    //
    // }
  },
  mounted: async function() {
    console.log('mounted')
    // this.hotId = await this.currentHotId()
    // this.resetSearchResult(this.hotId)
    // this.$subscribeTo(searchCounter$, function(result) {
    //   vueUpdateAllTablesAllColumnsNames(result)
    // })
  },
  created: function() {
    _searchAction = this.incrementSearchResultWrapper
  }
}
</script>
<style lang="styl" scoped>
@import '~static/css/findreplace'
</style>
