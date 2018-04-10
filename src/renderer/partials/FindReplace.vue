<template>
<form class="navbar-form form-horizontal" id="findAndReplace">
  <div class="form-group-sm row container-fluid">
    <div  class="propertyrow clearfix" v-for="(formprop, index) in formprops" :key="index">
      <label v-show="formprop.label" v-tooltip.left="tooltip(formprop.tooltipId)" class="control-label pull-left" :for="formprop.label">{{formprop.label}}</label>
      <component :is="formprop.tooltipView"/>
      <div class="inputrow">
        <div class="placeholder text-muted small" :data-placeholder="getResult(formprop.key)">
          <input class="pull-left" type="text" :class="{ 'form-control input-sm col-sm-9': true}" :id="formprop.key" :value="getText(formprop.key)" @input="setText(formprop.key, $event.target.value)" :name="formprop.key"/>
        </div>
        <span class="btn-group pull-right">
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
        <button type="button" class="button-below btn btn-sm" :class="formprop.buttonTypeClass || 'btn-default'" @click="formprop.belowFn('next')">
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
  hotIdFromTab$,
  currentPos$
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
let _currentHotPos = function() {}
let isSameDirectionArrayCalculated = false
let _sameDirectionArray = []

// TODO: may only need to call this once on initial find on reset (and move isSameDirectionArrayCalculated logic to parent Fn)
const _searchCallback = function(instance, row, col, value, result) {
  searchCallback.apply(this, arguments)
  if (result) {
    // only calculate same direction array once until reset
    if (!isSameDirectionArrayCalculated && _isInDirection(row, col, _currentHotPos)) {
      _sameDirectionArray.push({row: row, col: col})
    }
    _searchAction(instance.guid)
  }
}
// expose query method to potentially manipulate later
const _queryMethod = function(queryStr, value) {
  return searchQueryMethod(queryStr, value)
}

export default {
  extends: SideNav,
  name: 'findReplace',
  // mixins: [ValidationRules, TableTooltip],
  components: {
  },
  data() {
    return {
      activeHotId: null,
      findTypePicked: 'findInTable',
      findTextValue: '',
      replaceTextValue: '',
      totalFound: null,
      clickedFindOrReplace: null,
      previousOrNextIndex: -1,
      sameDirectionStartElement: null,
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
        fn: this.findText
      }, {
        label: 'Replace',
        key: 'replace',
        buttonTypeClass: 'btn-primary',
        buttonLeftClass: 'fa fa-chevron-left',
        buttonRightClass: 'fa fa-chevron-right',
        // buttonLeftText: 'Replace',
        buttonBelowText: 'Replace All',
        fn: this.replaceText,
        belowFn: this.replaceAllText
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
    ...mapGetters(['getLatestSearchResult', 'getHotSelection'])
  },
  methods: {
    ...mapMutations([
      'resetSearchResult', 'incrementSearchResult'
    ]),
    isNext: function(row, col, currentPos) {
      let isNext = (row > currentPos[0] || (row === currentPos[0] && col >= currentPos[1]))
      return isNext
    },
    isPrevious: function(row, col, currentPos) {
      let isPrevious = (row < currentPos[0] || (row === currentPos[0] && col <= currentPos[1]))
      return isPrevious
    },
    getResult: function(key) {
      // show result at either find or replace view
      if (key === this.clickedFindOrReplace) {
        const count = this.previousOrNextIndex + 1
        if (count >= 1) {
          return `${count} of ${this.totalFound}`
        } else {
          return 'No matches'
        }
      }
    },
    getText: function(key) {
      return key === 'find' ? this.findTextValue : this.replaceTextValue
    },
    setText: function(key, value) {
      if (key === 'find') {
        this.findTextValue = value
      } else {
        this.replaceTextValue = value
      }
      this.resetSearchResultWrapper()
    },
    replaceText: function(direction) {
      this.clickedFindOrReplace = 'replace'
      this.findNextOrPrevious(direction)
      const hot = HotRegister.getInstance(this.activeHotId)
      const selectedCoords = hot.getSelected()
      if (selectedCoords) {
        this.replacefindTextOnceWithinCell(hot, selectedCoords[0], selectedCoords[1])
      }
    },
    replaceAllText: function(direction) {
      this.clickedFindOrReplace = 'replace'
      this.findNextOrPrevious(direction)
      const hot = HotRegister.getInstance(this.activeHotId)
      const replaceTextFn = this.replacefindTextOnceWithinCell
      _.forEach(document.querySelectorAll('.search-result-hot'), function(el, index) {
        const selectedCoords = hot.getCoords(el)
        replaceTextFn(hot, selectedCoords.row, selectedCoords.col)
      })
    },
    replacefindTextOnceWithinCell: function(hot, row, col) {
      let cellText = hot.getDataAtCell(row, col)
      let updatedCellText = _.replace(cellText, this.findTextValue, this.replaceTextValue)
      hot.setDataAtCell(row, col, updatedCellText)
    },
    replaceEntireCellText: function(hot, row, col) {
      hot.setDataAtCell(row, col, this.replaceTextValue)
    },
    findText: function(direction) {
      this.clickedFindOrReplace = 'find'
      this.findNextOrPrevious(direction)
    },
    findNextOrPrevious: function(direction) {
      this.totalFound = 0
      const hot = HotRegister.getInstance(this.activeHotId)
      if (direction === 'previous') {
        _isInDirection = this.updateDirection(this.isPrevious)
      } else {
        _isInDirection = this.updateDirection(this.isNext)
      }
      hot.search.query(this.findTextValue)
      hot.render()
      this.initStartingElement(hot)
      const foundResultElements = document.querySelectorAll('.search-result-hot')
      this.totalFound = foundResultElements.length
      const coordsToSelect = this.getPreviousOrNextCoords(foundResultElements)
      // capture the index after capturing previous/next element, as element will be reset once selected
      this.previousOrNextIndex = this.getPreviousOrNextIndex(foundResultElements)
      if (this.previousOrNextIndex > -1) {
        hot.selectCell(coordsToSelect.row, coordsToSelect.col)
        // must update style after selection as affects style background
        this.updateAllFoundStyle(foundResultElements)
        this.pickPreviousOrNextElement(foundResultElements, this.previousOrNextIndex)
      }
      _sameDirectionArray.length = 0
      isSameDirectionArrayCalculated = true
    },
    initStartingElement: function(hot) {
      if (!_.isEmpty(_sameDirectionArray)) {
        let sameDirectionStartCoords
        if (_isInDirection == this.isPrevious) {
          // need to start at the last element of sameDirectionArray
          sameDirectionStartCoords = _sameDirectionArray[_sameDirectionArray.length - 1]
        } else {
          // need to start at first element of sameDirectionArray
          sameDirectionStartCoords = _sameDirectionArray[0]
        }
        this.sameDirectionStartElement = hot.getCell(sameDirectionStartCoords.row, sameDirectionStartCoords.col)
      }
    },
    getPreviousOrNextIndex: function(foundResultElements) {
      let matchingIndex = _.indexOf(foundResultElements, this.sameDirectionStartElement)
      if (matchingIndex === -1) {
        console.log('Unable to find starting element for find.')
      }
      return matchingIndex
    },
    getPreviousOrNextCoords: function(foundResultElements) {
      if (!_.isEmpty(foundResultElements)) {
        // current cursor may be beyond limits of previous/next start elements, but there are still result
        if (_.isEmpty(_sameDirectionArray) && !this.sameDirectionStartElement) {
          if (_isInDirection == this.isPrevious) {
            this.sameDirectionStartElement = foundResultElements[foundResultElements.length - 1]
          } else {
            this.sameDirectionStartElement = foundResultElements[0]
          }
        }
        const hotId = this.activeHotId
        const hot = HotRegister.getInstance(hotId)
        const coordsToSelect = hot.getCoords(this.sameDirectionStartElement)
        return coordsToSelect
      }
    },
    updateAllFoundStyle: function(foundResultElements) {
      const style = this.foundStyle
      _.forEach(foundResultElements, function(el, index) {
        for (const property of _.keys(style)) {
          el.style[property] = style[property]
        }
      })
    },
    pickPreviousOrNextElement: function(foundResultElements, matchingIndex) {
      if (_isInDirection == this.isPrevious) {
        matchingIndex--
        if (matchingIndex < 0) {
          matchingIndex = foundResultElements.length - 1
        }
      } else {
        matchingIndex++
        if (matchingIndex >= foundResultElements.length) {
          matchingIndex = 0
        }
      }
      this.sameDirectionStartElement = foundResultElements[matchingIndex]
    },
    updateDirection: function(directionFn) {
      if (directionFn != _isInDirection) {
        this.resetSearchResultWrapper()
      }
      return directionFn
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
      this.totalFound = this.getLatestSearchResult(this.activeHotId)
    },
    resetSearchResultWrapper: function() {
      this.resetSearchResult(this.activeHotId)
      this.removeFoundStyle()
      // on text entry reset current cursor position
      _currentHotPos = this.getHotSelection(this.activeHotId)
      isSameDirectionArrayCalculated = false
      this.sameDirectionStartElement = null
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
    this.$subscribeTo(currentPos$, function(currentPos) {
      vueResetSearchResult()
    })
  },
  created: function() {
    _searchAction = this.incrementSearchResultWrapper
    _currentHotPos = this.getHotSelection
  }
}
</script>
<style lang="styl" scoped>
@import '~static/css/findreplace'
</style>
