<template>
<form class="navbar-form form-horizontal" id="findAndReplace">
  <div class="form-group-sm row container-fluid">
    <div  class="propertyrow" v-for="(formprop, index) in formprops" :key="index">
      <label v-show="formprop.label" v-tooltip.left="tooltip(formprop.tooltipId)" class="control-label" :for="formprop.label">{{formprop.label}}</label>
      <component :is="formprop.tooltipView"/>
      <div class="inputrow">
        <div class="placeholder text-muted" :data-placeholder="formprop.key === 'find' ? findResult : replaceResult">
          <input type="text" :class="{ 'form-control input-sm col-sm-9': true}" :id="formprop.key" :value="getText(formprop.key)" @input="setText(formprop.key, $event.target.value)" :name="formprop.key"/>
        </div>
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
  searchCallback,
  searchQueryMethod,
  getActiveSelectedOrHotSelectionOrMin
} from '../hot.js'
import VueRx from 'vue-rx'
import {
  Subscription
} from 'rxjs/Subscription'
import {
  hotIdFromTab$
} from '@/rxSubject.js'
// import TableTooltip from '../mixins/TableTooltip'
// import ValidationRules from '../mixins/ValidationRules'
// import {
//   Validator
// } from 'vee-validate'
Vue.use(AsyncComputed)
Vue.use(VueRx, {
  Subscription
})
let _searchAction = function() {}
let _isInDirection = function() {}
let _currentHotPos = getActiveSelectedOrHotSelectionOrMin
const _searchCallback = function(instance, row, col, value, result) {
  if (!_isInDirection(row, col, _currentHotPos())) {
    instance.getCellMeta(row, col).isSearchResult = false
    return
  }
  searchCallback.apply(this, arguments)
  if (result) {
    _searchAction(instance.guid)
  }
}
// expose query method to potentially manipulate later
const _queryMethod = function(queryStr, value) {
  return searchQueryMethod(queryStr, value)
}

const isNext = function(row, col, currentPos) {
  let isNext = (row > currentPos[0] || (row === currentPos[0] && col >= currentPos[1]))
  console.log(`is Next is: ${isNext}`)
  return isNext
}

const isPrevious = function(row, col, currentPos) {
  let isPrevious = (row < currentPos[0] || (row === currentPos[0] && col <= currentPos[1]))
  console.log(`is Previous is: ${isPrevious}`)
  return isPrevious
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
      findResult: null,
      replaceResult: null,
      foundStyle: {
        backgroundColor: 'rgba(70, 237, 70, 0.3)'
      },
      hotParameters: {
        searchResultClass: 'search-result-hot',
        callback: _searchCallback,
        queryMethod: _queryMethod
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
      this.resetSearchResultWrapper()
      const hot = HotRegister.getInstance(this.activeHotId)
      if (direction === 'previous') {
        _isInDirection = isPrevious
      } else {
        _isInDirection = isNext
      }
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
    removeFoundStyle: function() {
      document.querySelectorAll('.search-result-hot').forEach(function(el) {
        el.style = {}
      })
    },
    updateActiveHotId: function(hotId) {
      this.activeHotId = hotId
    },
    incrementSearchResultWrapper: function() {
      this.incrementSearchResult(this.activeHotId)
      this.findResult = this.getLatestSearchResult(this.activeHotId)
    },
    resetSearchResultWrapper: function() {
      this.resetSearchResult(this.activeHotId)
      this.findResult = this.getLatestSearchResult(this.activeHotId)
      this.removeFoundStyle()
      this.findResult = null
      this.replaceResult = null
    }
  },
  mounted: async function() {
    this.activeHotId = await this.currentHotId()
    const vueUpdateActiveHotId = this.updateActiveHotId
    const vueResetSearchResult = this.resetSearchResultWrapper
    this.$subscribeTo(hotIdFromTab$, function(hotId) {
      vueUpdateActiveHotId(hotId)
      vueResetSearchResult()
    })
  },
  created: function() {
    _searchAction = this.incrementSearchResultWrapper
  }
}
</script>
<style lang="styl" scoped>
@import '~static/css/findreplace'
</style>
