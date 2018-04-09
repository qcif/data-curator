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
// let _callbackCount = 0
let _matchCount = 0
let _totalFinds = 0
let _totalDirectionFinds = 0
let isSameDirectionArrayCalculated = false
let _sameDirectionArray = []

// TODO: may only need to call this once on initial find on reset (and move isSameDirectionArrayCalculated logic to parent Fn)
const _searchCallback = function(instance, row, col, value, result) {
  // if (!_isInDirection(row, col, _currentHotPos)) {
  //   instance.getCellMeta(row, col).isSearchResult = false
  //   return
  // }
  searchCallback.apply(this, arguments)
  if (result) {
    // only calculate same direction array once until reset
    if (!isSameDirectionArrayCalculated && _isInDirection(row, col, _currentHotPos)) {
      // console.log('calculating array...')
      // if (++_callbackCount === _matchCount) {
      // console.log(`callback count is ${_callbackCount}`)
      // console.log(`match count in search callback is ${_matchCount}`)
      // instance.selectCell(row, col)
      // }
      // console.log(`match count in search callback is ${_matchCount}`)
      _sameDirectionArray.push({row: row, col: col})
    }
    // console.log(`match count before search counter is ${_matchCount}`)
    _searchAction(instance.guid)
    // console.log(`match count after search counter is ${_matchCount}`)
  }
  // console.log(`match count at end of search callback is ${_matchCount}`)
}
// expose query method to potentially manipulate later
const _queryMethod = function(queryStr, value) {
  return searchQueryMethod(queryStr, value)
}

const isNext = function(row, col, currentPos) {
  // let distance = getDistance(row, col, currentPos)
  let isNext = (row > currentPos[0] || (row === currentPos[0] && col >= currentPos[1]))
  // console.log(`is Next is: ${isNext}`)
  return isNext
}

const isPrevious = function(row, col, currentPos) {
  console.log('checking is previous')
  // let distance = getDistance(row, col, currentPos)
  let isPrevious = (row < currentPos[0] || (row === currentPos[0] && col <= currentPos[1]))
  // console.log(`is Previous is: ${isPrevious}`)
  return isPrevious
}

const getDistance = function(row, col, currentPos) {
  return math.distance([currentPos[0], currentPos[1]], [row, col])
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
      findResult: null,
      replaceResult: null,
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
        buttonLeftText: 'Replace',
        buttonBelowText: 'Replace All',
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
    ...mapGetters(['getLatestSearchResult', 'getHotSelection'])
  },
  methods: {
    ...mapMutations([
      'resetSearchResult', 'incrementSearchResult'
    ]),
    getResult: function(key) {
      // console.log(`callback count in getresult is ${_callbackCount}`)
      // console.log(`match count in getresult is ${_matchCount}`)
      // console.log(`find result in getresult is ${this.findResult}`)
      const count = key === 'find' ? this.findResult : this.replaceResult
      if (count > 1) {
        return `${count} matches`
      } else if (count === 1) {
        return `${count} match`
      } else if (count === 0) {
        return 'No matches'
      } else {
        return null
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
    findText: function(direction) {
      // console.log(`match count in beginning of click: ${_matchCount}`)
      _totalFinds = 0
      _totalDirectionFinds = 0
      // console.log(`triggered find text`)
      // console.log(`direction is ${direction}`)
      this.findResult = 0
      // _callbackCount = 0
      const hot = HotRegister.getInstance(this.activeHotId)
      if (direction === 'previous') {
        _isInDirection = this.updateDirection(isPrevious)
      } else {
        _isInDirection = this.updateDirection(isNext)
      }
      // _matchCount++
      // console.log(`match count after increment: ${_matchCount}`)
      // console.log(`after match count increment, match count: ${_matchCount}`)
      // console.log(`is in direction is ${_isInDirection}`)
      console.log('before queries, same direction array')
      console.log(_sameDirectionArray)
      hot.search.query(this.findTextValue)
      // render will add the search class to all relevant cells
      // console.log(`match count before render: ${_matchCount}`)
      hot.render()
      // update search class style
      // console.log(`match count before update: ${_matchCount}`)
      console.log('checking array for same direction...')
      console.log(_sameDirectionArray)
      console.log(_.isEmpty(_sameDirectionArray))
      if (!_.isEmpty(_sameDirectionArray)) {
        // this.sameDirectionArray.length = 0
        // console.log('same direction array')
        // console.log(_sameDirectionArray)
        // console.log(this.sameDirectionArray)
        // console.log(this.sameDirectionStartCoords)
        let sameDirectionStartCoords
        console.log('same direction coords')
        if (_isInDirection == isPrevious) {
          // need to start at the last element of sameDirectionArray
          sameDirectionStartCoords = _sameDirectionArray[_sameDirectionArray.length - 1]
        } else {
          // need to start at first element of sameDirectionArray
          sameDirectionStartCoords = _sameDirectionArray[0]
        }
        console.log(sameDirectionStartCoords)
        this.sameDirectionStartElement = hot.getCell(sameDirectionStartCoords.row, sameDirectionStartCoords.col)
      }
      // console.log('same direction array after')
      // console.log(_sameDirectionArray)
      // console.log(this.sameDirectionArray)
      // console.log(this.sameDirectionStartCoords)
      this.updateAllFound()
      // need to know if same direction array is empty, but there are still found elements
      _sameDirectionArray.length = 0
      // ensure same direction toggled after any cell reselection triggers reset
      isSameDirectionArrayCalculated = true

      // console.log(`match count before: ${_matchCount}`)
      // if (_matchCount >= _totalFinds) {
      //   // console.log(`match count during: ${_matchCount}`)
      //   _matchCount = 0
      // }
      // console.log(`after find text complete, total direction finds is ${_totalDirectionFinds}`)
      // console.log(`after find text complete, total finds is ${_totalFinds}`)
      // console.log(_callbackCount)
    },
    replaceText: function(direction) {
      // console.log(`triggered replace text`)
      // console.log(this.findTypePicked)
      // console.log(direction)
      // console.log(this.findTextValue)
      // console.log(this.replaceTextValue)
    },
    updateAllFound: function() {
      const foundResultElements = document.querySelectorAll('.search-result-hot')
      _totalFinds = foundResultElements.length
      if (++_matchCount > _totalFinds) {
        // console.log(`match count during: ${_matchCount}`)
        _matchCount = 1
      }
      console.log(`match count: ${_matchCount}`)
      // match count -1 = index
      if (!_.isEmpty(foundResultElements)) {
        // current cursor may be beyond limits of previous/next start elements, but there are still result
        if (_.isEmpty(_sameDirectionArray) && !this.sameDirectionStartElement) {
          if (_isInDirection == isPrevious) {
            this.sameDirectionStartElement = foundResultElements[foundResultElements.length - 1]
          } else {
            this.sameDirectionStartElement = foundResultElements[0]
          }
        }
        // ensure direction wraps around when reached end
        // const matchIndexCount = _matchCount - 1
        // start find at element index previous/next to current cursor position
        // console.log(this.sameDirectionStartCoords)
        console.log(foundResultElements)
        let matchingIndex = _.indexOf(foundResultElements, this.sameDirectionStartElement)
        if (matchingIndex === -1) {
          throw new Error('Unable to find starting element for find.')
        }
        const hotId = this.activeHotId
        let hot = HotRegister.getInstance(hotId)
        let coordsToSelect = hot.getCoords(this.sameDirectionStartElement)
        // console.log(`matchingIndex to begin: ${matchingIndex}`)
        // console.log(_isInDirection)
        // let matchCountIndex = _matchCount - 1
        // console.log(`match count index: ${matchCountIndex}`)
        // if (_isInDirection == isPrevious) {
        //   console.log('backwards')
        //   // need to match count backwards and wrap
        //   matchingIndex = ((matchingIndex - matchCountIndex) + foundResultElements.length) % foundResultElements.length
        //   console.log(`backwards number is ${matchingIndex}`)
        // } else {
        //   console.log('forwards')
        //   // need to match count forwards and wrap
        //   matchingIndex = (matchingIndex + matchCountIndex) % foundResultElements.length
        // }
        // console.log(`after match index added: ${matchingIndex}`)
        // console.log(`mod is: ${matchingIndex % foundResultElements.length}`)
        // matchingIndex = matchingIndex % foundResultElements.length
        // if (matchingIndex < 0) {
        //   matchingIndex = foundResultElements.length - 1
        // } else if (matchingIndex === foundResultElements.length) {
        //   matchingIndex = 0
        // } else if (matchingIndex > foundResultElements.length) {
        //   matchingIndex = matchingIndex - foundResultElements.length
        // }
        // console.log(`matching index after wrap is ${matchingIndex}`)

        // let elementToSelect = foundResultElements[matchingIndex]
        // const hotId = this.activeHotId
        // let hot = HotRegister.getInstance(hotId)
        // let coordsToSelect = hot.getCoords(elementToSelect)
        const tempMatchCount = _matchCount
        hot.selectCell(coordsToSelect.row, coordsToSelect.col)
        _matchCount = tempMatchCount
        this.updateFoundStyle(foundResultElements)
        // now pick next element
        if (_isInDirection == isPrevious) {
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

        // if (_isInDirection(row, col, _currentHotPos)) { hot.selectCell(coordsToSelect.row, coordsToSelect.col) }
        // console.log(`match count temp is ${_matchCount}`)
        // workaround when match count reset if say user clicks in cell

        // console.log(`match count now is ${_matchCount}`)
      }
    },
    updateFoundStyle: function(foundResultElements) {
      const style = this.foundStyle
      _.forEach(foundResultElements, function(el, index) {
        // console.log(`index is ${index}`)
        for (const property of _.keys(style)) {
          el.style[property] = style[property]
        }
      })
    },
    updateDirection: function(directionFn) {
      if (directionFn != _isInDirection) {
        // console.log('direction has changed. resetting...')
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
      this.findResult = this.getLatestSearchResult(this.activeHotId)
    },
    resetSearchResultWrapper: function() {
      // console.log('resetting...')
      this.resetSearchResult(this.activeHotId)
      // console.log(`find result reset is: ${this.findResult}`)
      this.removeFoundStyle()
      // console.log('setting to null')
      this.findResult = null
      this.replaceResult = null
      // on text entry reset current cursor position
      _currentHotPos = this.getHotSelection(this.activeHotId)
      // console.log(`find result reset is: ${this.findResult}`)
      _matchCount = 0
      // _callbackCount = 0
      _totalFinds = 0
      _totalDirectionFinds = 0
      isSameDirectionArrayCalculated = false
      this.sameDirectionStartElement = null
    }
  },
  mounted: async function() {
    this.activeHotId = await this.currentHotId()
    const vueUpdateActiveHotId = this.updateActiveHotId
    const vueResetSearchResult = this.resetSearchResultWrapper
    this.$subscribeTo(hotIdFromTab$, function(hotId) {
      // console.log('got new hot id. updating hotid ref and resetting..')
      vueUpdateActiveHotId(hotId)
      vueResetSearchResult()
    })
    this.$subscribeTo(currentPos$, function(currentPos) {
      // console.log('got new current pos. resetting..')
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
