<template>
  <form
    id="findAndReplace"
    class="navbar-form form-horizontal">
    <div class="form-group-sm row container-fluid">
      <div
        v-for="(formprop, index) in formprops"
        :key="index"
        class="propertyrow clearfix">
        <label
          v-tooltip.left="tooltip(formprop.tooltipId)"
          v-show="formprop.label"
          :for="formprop.label"
          class="control-label pull-left">{{ formprop.label }}</label>
        <div class="inputrow clearfix">
          <div
            :class="formprop.key"
            :data-placeholder="formprop.resultFn(formprop.key)"
            class="placeholder text-muted small">
            <input
              :id="formprop.key"
              :value="getText(formprop.key)"
              :name="formprop.key"
              class="pull-left form-control input-sm col-sm-9"
              type="text"
              @input="setText(formprop.key, $event.target.value)">
            <span
              v-show="formprop.resultFn(formprop.key)"
              :class="formprop.resultIconFn()"
              class="glyphicon form-control-feedback"/>
          </div>
          <span class="btn-group pull-right">
            <button
              :class="formprop.buttonTypeClass || 'btn-primary'"
              type="button"
              class="btn btn-sm"
              @click="formprop.fn('previous')">
              <span
                v-if="formprop.buttonLeftClass"
                :class="formprop.buttonLeftClass"/>
              <template v-if="formprop.buttonLeftText">
                {{ formprop.buttonLeftText }}
              </template>
            </button>
            <button
              v-show="formprop.buttonRightClass"
              :class="formprop.buttonTypeClass || 'btn-primary'"
              type="button"
              class="btn btn-sm"
              @click="formprop.fn('next')">
              <span :class="formprop.buttonRightClass"/>
            </button>
          </span>
        </div>
        <div
          v-if="formprop.buttonBelowText"
          class="btn-group pull-right">
          <button
            :class="formprop.buttonTypeClass || 'btn-primary'"
            type="button"
            class="button-below btn btn-sm"
            @click="formprop.belowFn('next')">
            <span :class="formprop.buttonBelowClass">{{ formprop.buttonBelowText }}</span>
          </button>
        </div>
      </div>
      <!-- <div class="pickrow">
                    <span v-for="(radioprop, index) in radioprops">
                      <input type="radio" :id="radioprop.key" :value="radioprop.value" v-model="findTypePicked">
                      <label for="find-in-column">{{radioprop.label}}</label>
                    </span>
                  </div> -->
    </div>
  </form>
</template>
<script>
import {
  mapGetters
} from 'vuex'
import SideNav from './SideNav'
import Vue from 'vue'
import AsyncComputed from 'vue-async-computed'
import {
  HotRegister
} from '../hot.js'
import VueRx from 'vue-rx'
import {
  Subscription
} from 'rxjs/Subscription'
import {
  hotIdFromTab$,
  currentPos$
} from '@/rxSubject.js'
import Sifter from 'sifter/sifter.min.js'
import { ipcRenderer as ipc } from 'electron'

Vue.use(AsyncComputed)
Vue.use(VueRx, {
  Subscription
})

let _lastRowIndicies = []
let _currentHotPos = [-1, -1]
let _previousSearchClear = true
let _inSearch = false

// TODO: remove dependency on handsontable and just render at search collection
// cannot access DEFAULT anymore - must copy (https://docs.handsontable.com/3.0.0/demo-searching.html#page-custom-callback)
const _defaultCallback = function (instance, row, col, data, testResult) {
  instance.getCellMeta(row, col).isSearchResult = testResult
}
const _searchCallback = function (instance, row, col, value, result) {
  // const defaultCallback = instance.getCallback()
  if (!_previousSearchClear && _.indexOf(_lastRowIndicies, row) > -1) {
    _defaultCallback.apply(this, arguments)
  } else if (col === _currentHotPos[1]) {
    _defaultCallback.apply(this, arguments)
  }
}

// const DEFAULT_QUERY_METHOD = function DEFAULT_QUERY_METHOD (query, value) {
//   if (isUndefined(query) || query === null || !query.toLowerCase || query.length === 0) {
//     return false
//   }
//   if (isUndefined(value) || value === null) {
//     return false
//   }
//
//   return value.toString().toLowerCase().indexOf(query.toLowerCase()) !== -1
// }

const _DEFAULT_SEARCH_RESULT_CLASS = 'htSearchResult'

// function _toConsumableArray (arr) {
//   if (Array.isArray(arr)) {
//     for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i] }
//     return arr2
//   } else { return Array.from(arr) }
// }

function _onBeforeRenderer(TD, row, col, prop, value, cellProperties) {
  if (_inSearch) {
    _resetSearchResultClass(TD, row, col, prop, value, cellProperties)
  }

  // else {
  //   _clearAllCellsOfSearchClass(TD, row, col, prop, value, cellProperties)
  // }
}

function _resetSearchResultClass(TD, row, col, prop, value, cellProperties) {
  if (_previousSearchClear) {
    _addSearchClassToCell(row, col, cellProperties)
  } else {
    if (_lastRowIndicies.includes(row)) {
      _clearAllCellsOfSearchClass(cellProperties)
    }
  }
}

function _addSearchClassToCell(row, col, cellProperties) {
  let className = _.get(cellProperties, 'className')
  if (_lastRowIndicies.includes(row) && col === _currentHotPos[1] && !_.includes(className, _DEFAULT_SEARCH_RESULT_CLASS)) {
    if (_.isString(className) && _.isEmpty(_.trim(className))) {
      cellProperties.className = _.trim(`${className} ${_DEFAULT_SEARCH_RESULT_CLASS}`)
    } else if (_.isArray(className)) {
      // it is an array
      cellProperties.className = _.concat(className, _DEFAULT_SEARCH_RESULT_CLASS)
    } else {
      // ignore and reset
      cellProperties.className = _DEFAULT_SEARCH_RESULT_CLASS
    }
  }
  console.log(`row ${row} and col ${col} now has class: ${cellProperties.className}`)
}

function _clearAllCellsOfSearchClass(cellProperties) {
  let className = _.get(cellProperties, 'className')
  if (_.includes(className, _DEFAULT_SEARCH_RESULT_CLASS)) {
    if (_.isString(className)) {
      const regExp = new RegExp(_DEFAULT_SEARCH_RESULT_CLASS, 'g')
      cellProperties.className = _.replace(className, regExp, '')
    } else if (_.isArray(className)) {
    // it is an array
      _.pull(cellProperties.className, _DEFAULT_SEARCH_RESULT_CLASS)
    } else {
    // ignore and reset
      cellProperties.className = ''
    }
  }
}

export default {
  name: 'FindReplace',
  components: {},
  extends: SideNav,
  data () {
    return {
      activeHotId: null,
      findTypePicked: 'findInColumn',
      findTextValue: '',
      replaceTextValue: '',
      clickedFindOrReplace: null,
      rowIndicies: null,
      currentCol: null,
      updatedRowIndex: -1,
      replacesRemaining: -1,
      foundCount: 0,
      foundCounter: 0,
      replaceMessageText: '',
      replaceData: [],
      // foundStyle: {
      //   backgroundColor: 'rgba(70, 237, 70, 0.3)'
      // },
      hotParameters: {
        callback: _searchCallback,
        rendererFn: _onBeforeRenderer
      },
      formprops: [{
        label: 'Find in column',
        key: 'find',
        buttonLeftClass: 'fa fa-chevron-left findPrevious',
        buttonRightClass: 'fa fa-chevron-right findNext',
        fn: this.findText,
        resultFn: this.findResults,
        resultIconFn: this.getFindResultIcon
      }, {
        label: 'Replace in column',
        key: 'replace',
        buttonLeftClass: 'fa fa-chevron-left replacePrevious',
        buttonRightClass: 'fa fa-chevron-right replaceNext',
        // buttonLeftText: 'Replace',
        buttonBelowText: 'Replace All',
        buttonBelowClass: 'replaceAll',
        fn: this.replaceText,
        belowFn: this.replaceAllText,
        resultFn: this.replaceResults,
        resultIconFn: this.getReplaceResultIcon
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
    ...mapGetters(['getHotSelection'])
  },
  mounted: async function () {
    console.log('mounting find')
    this.activeHotId = await this.currentHotId()
    HotRegister.addHookForHotId(this.activeHotId, 'beforeRenderer', _onBeforeRenderer)
    const self = this
    const vueUpdateActiveHotId = this.updateActiveHotId
    const vueResetOnColumnChange = this.resetOnColumnChange
    const vueResetSearchResult = this.resetSearchResultWrapper
    const vueResetRowIndex = this.resetRowIndex
    this.$subscribeTo(hotIdFromTab$, function (hotId) {
      vueUpdateActiveHotId(hotId)
      vueResetSearchResult()
      self.clearPreviousHotSearch(HotRegister.getActiveInstance())
      HotRegister.resetHookForAllHots('beforeRenderer', _onBeforeRenderer)
      HotRegister.getActiveInstance().render()
      HotRegister.addHookForHotId(hotId, 'beforeRenderer', _onBeforeRenderer)
    })
    this.$subscribeTo(currentPos$, function (currentPos) {
      self.clearPreviousHotSearch(HotRegister.getActiveInstance())
      HotRegister.resetHookForAllHots('beforeRenderer', _onBeforeRenderer)
      HotRegister.getActiveInstance().render()
      HotRegister.addHookForHotId(self.activeHotId, 'beforeRenderer', _onBeforeRenderer)
      vueResetOnColumnChange()
      vueResetRowIndex()
    })
    ipc.on('clickFindButton', function (event, arg) {
      let el = document.querySelector(`button .${arg}`).parentNode
      el.click()
      el.classList.add('active', 'focus')
    })
  },
  beforeDestroy: async function () {
    HotRegister.resetHookForAllHots('beforeRenderer', _onBeforeRenderer)
    console.log('destroyed Find')
  },
  methods: {
    getReplaceResultIcon: function () {
      return (this.replacesRemaining > 0) ? 'glyphicon-ok' : 'glyphicon-remove'
    },
    getFindResultIcon: function () {
      return (this.foundCount && this.foundCount.length > 0) ? 'glyphicon-ok' : 'glyphicon-remove'
    },
    findResults: function (key) {
      // show result at either find or replace view
      if (key === this.clickedFindOrReplace) {
        // TODO: tidy use cases for updatedRowIndex, so updatedCount not needed
        const count = this.foundCounter + 1
        if (count > 0 && this.foundCount.length > 0) {
          this.inputFoundSuccessFeedback(key)
          return `${count} of ${this.foundCount.length}`
        } else {
          this.inputFoundFailureFeedback(key)
          return 'No result'
        }
      }
    },
    replaceResults: function (key) {
      // show result at either find or replace view
      if (key === this.clickedFindOrReplace) {
        if (this.replacesRemaining > -1) {
          this.inputFoundSuccessFeedback(key)
          return `${this.replacesRemaining} ${this.replaceMessageText}.`
        } else {
          this.inputFoundFailureFeedback(key)
          return 'No result'
        }
      }
    },
    inputFoundSuccessFeedback: function (key) {
      let element = this.initFeedbackContainer(key)
      element.classList.add('has-success')
    },
    inputFoundFailureFeedback: function (key) {
      let element = this.initFeedbackContainer(key)
      element.classList.add('has-error')
    },
    initFeedbackContainer: function (key) {
      this.inputFoundRemoveFeedback()
      return document.querySelector(`#findAndReplace .placeholder.${key}`)
    },
    inputFoundRemoveFeedback: function () {
      _.forEach(document.querySelectorAll('#findAndReplace .placeholder'), function (el, index) {
        el.classList.remove('has-success')
        el.classList.remove('has-error')
      })
    },
    getText: function (key) {
      return key === 'find' ? this.findTextValue : this.replaceTextValue
    },
    setText: function (key, value) {
      if (key === 'find') {
        this.findTextValue = value
      } else {
        this.replaceTextValue = value
      }
      this.foundCounter = -1
      this.foundCount = -1
      // HotRegister.resetHookForAllHots('beforeRenderer', _onBeforeRenderer)
      // HotRegister.getActiveInstance().render()
      // HotRegister.addHookForHotId(this.activeHotId, 'beforeRenderer', _onBeforeRenderer)
      this.resetSearchResultWrapper()
      // this.clickedFindOrReplace = null
      // wait for the css to update from resetting counters then remove all
      const vueInputFoundRemoveFeedback = this.inputFoundRemoveFeedback
      const self = this
      _.delay(function () {
        vueInputFoundRemoveFeedback()
        // HotRegister.resetHookForAllHots('beforeRenderer', _onBeforeRenderer)
        HotRegister.getActiveInstance().render()
        // HotRegister.addHookForHotId(self.activeHotId, 'beforeRenderer', _onBeforeRenderer)
      }, 10)
    },
    replaceText: function (direction) {
      // this.inputFoundRemoveFeedback()
      if (this.clickedFindOrReplace === 'find') {
        this.resetSearchResultWrapper()
      }
      if (this.clickedFindOrReplace === 'replace') {
        if (direction === 'next') {
          this.updatedRowIndex--
        }
      }
      this.clickedFindOrReplace = 'replace'
      this.replaceMessageText = 'remaining'
      this.findNextOrPrevious(direction)
      // console.time()
      const hot = HotRegister.getInstance(this.activeHotId)
      if (_.isEmpty(this.replaceData)) {
        // TODO: check if caching data can also improve performance on large data sets

        this.replaceData = hot.getData()
      }
      // console.timeEnd()
      const selectedCoords = hot.getSelectedLast()
      if (selectedCoords) {
        const row = selectedCoords[0]
        const col = selectedCoords[1]
        let updatedCellText = this.getReplacedAllFindTextFromCell(this.replaceData, row, col)
        // if (updatedCellText) {
        hot.setDataAtCell(row, col, updatedCellText)
        this.rowIndicies.splice(this.updatedRowIndex, 1)
        this.replacesRemaining = this.rowIndicies.length
        // }
      }
      // this.clickedFindOrReplace = 'replace'
      // this.resetOnColumnChange()
      this.clickedFindOrReplace = 'replace'
    },
    replaceAllText: function (direction) {
      if (this.clickedFindOrReplace === 'find') {
        this.resetSearchResultWrapper()
      }
      this.clickedFindOrReplace = 'replace'
      this.replaceMessageText = 'replaced'
      this.findNextOrPrevious(direction)
      this.replacesRemaining = this.rowIndicies.length
      const hot = HotRegister.getInstance(this.activeHotId)
      const col = this.currentCol
      let data = hot.getData()
      for (const row of this.rowIndicies) {
        data[row][col] = this.getReplacedAllFindTextFromCell(data, row, col)
      }
      // bulk change data
      hot.loadData(data)
      this.clickedFindOrReplace = 'replace'
    },
    // Ensure replace, like find, is case insensitive
    getReplacedAllFindTextFromCell: function (data, row, col) {
      let cellText = data[row][col]
      let caseInsensitiveCellText = cellText.toLowerCase()
      let caseInsensitiveFindTextValue = this.findTextValue.toLowerCase()
      // ensure any special characters in find text are treated as ordinary text
      const escapedFindText = _.escapeRegExp(caseInsensitiveFindTextValue)
      const regExp = new RegExp(escapedFindText, 'g')
      let updatedCellText = _.replace(caseInsensitiveCellText, regExp, this.replaceTextValue)
      return updatedCellText
    },
    previousFn: function (index, arrayLength) {
      index = index > 0 ? index - 1 : arrayLength - 1
      return index
    },
    nextFn: function (index, arrayLength) {
      if (index >= arrayLength - 1) {
        index = 0
      } else {
        index = index + 1
      }
      return index
    },
    findText: function (direction) {
      if (this.clickedFindOrReplace === 'replace') {
        this.resetSearchResultWrapper()
      }
      this.clickedFindOrReplace = 'find'
      this.findNextOrPrevious(direction)
      // a new index calculation will reset this.clickedFindOrReplace so ensure for first run it is referenced again for feedback
      this.clickedFindOrReplace = 'find'
    },
    findNextOrPrevious: function (direction) {
      console.time()
      let directionFn
      if (direction === 'previous') {
        directionFn = this.previousFn
      } else {
        directionFn = this.nextFn
      }
      const hot = HotRegister.getInstance(this.activeHotId)
      const currentHotPos = this.getHotSelection(this.activeHotId)
      _currentHotPos = currentHotPos
      const currentRow = currentHotPos[0]
      const currentCol = currentHotPos[1]
      if (!this.rowIndicies || _.isEmpty(this.rowIndicies) || this.currentCol != currentCol) {
        this.resetSearchResultWrapper()
        this.clearPreviousHotSearch(hot)
        // this.hotSearch(hot)
        let colData = hot.getDataAtCol(currentCol)
        // indexer won't work with a header labelled: 0
        let tempHeader = currentCol + 1
        let colObject = _.map(colData, function (item) {
          return { [tempHeader]: item }
        })
        this.currentCol = currentCol
        // to avoid whether headers are set or not, can just use index for now
        this.rowIndicies = this.hotSiftWithoutTransform(colObject, [tempHeader])
        let tempLastRowIndicies = _.clone(_lastRowIndicies)
        let tempCurrentHotPos = _.clone(_currentHotPos)
        _lastRowIndicies = this.rowIndicies
        _currentHotPos = currentHotPos
        console.time()
        this.hotSearch(hot)
        console.timeEnd()
        _lastRowIndicies = _.clone(tempLastRowIndicies)
        _currentHotPos = _.clone(tempCurrentHotPos)
      }
      this.foundCount = this.rowIndicies
      if (this.updatedRowIndex >= 0) {
        this.updatedRowIndex = directionFn(this.updatedRowIndex, this.rowIndicies.length)
      } else {
        this.updatedRowIndex = this.determineStartingRowIndex(currentRow, direction, directionFn)
      }
      this.foundCounter = this.updatedRowIndex
      let updatedRow = this.rowIndicies[this.updatedRowIndex]
      hot.scrollViewportTo(updatedRow, currentCol)
      // preserve rowIndicies and currentCol on reset
      let tempRowIndicies = this.rowIndicies
      let tempUpdatedRowIndex = this.updatedRowIndex
      hot.selectCell(updatedRow, currentCol)
      this.rowIndicies = tempRowIndicies
      this.currentCol = currentCol
      this.updatedRowIndex = tempUpdatedRowIndex
    },
    hotSearch: function(hot) {
      // TODO : add loading screen here
      _inSearch = true
      // const search = hot.getPlugin('search')
      // search.query(this.findTextValue)
      hot.render()
      _inSearch = false
    },
    clearPreviousHotSearch: function (hot) {
      _inSearch = true
      _previousSearchClear = false
      // const search = hot.getPlugin('search')
      // search.query()
      hot.render()
      _previousSearchClear = true
      _inSearch = false
    },
    // hotSift: function(data, headers) {
    //   console.time()
    //   const transformed = this.transformHotToArrayOfObjects(data, headers)
    //   console.log(transformed)
    //   let rowIndicies = this.sift(transformed, headers)
    //   // sort in ascending order
    //   rowIndicies.sort(function(a, b) {
    //     return a - b
    //   })
    //   console.timeEnd()
    //   return rowIndicies
    // },
    hotSiftWithoutTransform: function (arrayOfObjects, headers) {
      let rowIndicies = this.sift(arrayOfObjects, headers)
      // sort in ascending order
      rowIndicies.sort(function (a, b) {
        return a - b
      })
      return rowIndicies
    },
    // transformHotToArrayOfObjects: function(rows, headers) {
    //   const mapFn = this.mapArrayToObject
    //   let result = []
    //   const transformer = transform(function(row) {
    //     return mapFn(row, headers)
    //   })
    //   transformer.on('readable', function() {
    //     let row = transformer.read()
    //     while (row) {
    //       result.push(row)
    //       row = transformer.read()
    //     }
    //   })
    //   transformer.on('error', function(err) {
    //     console.log(err.message)
    //     transformer.end()
    //   })
    //   for (const row of rows) {
    //     transformer.write(row)
    //   }
    //   transformer.end()
    //   return result
    // },
    // mapArrayToObject: function(row, headers) {
    //   let object = _.reduce(row, function(result, value, index) {
    //     result[headers[index]] = value
    //     return result
    //   }, {})
    //   return object
    // },
    // Note: sift will return 1 match for multiple matches in row
    // sift gives flexibility for reasonably fast access, but allows to search across table rows too if needed later + diacritics support
    sift: function (arrayOfObjects, headers) {
      // case-sensitive
      var sifter = new Sifter(arrayOfObjects, { diacritics: false })
      let result
      let ids = []
      if (this.findTextValue) {
        result = sifter.search(this.findTextValue, {
          fields: headers,
          conjunction: 'and'
        })
        let header = headers[0]
        for (const item of result.items) {
          // case-sensitive
          let nextValue = arrayOfObjects[item.id][header]
          if (nextValue.includes(this.findTextValue)) {
            ids.push(item.id)
          }
        }
      }
      return ids
    },
    determineStartingRowIndex: function (currentRow, direction, directionFn) {
      let index = _.sortedIndex(this.rowIndicies, currentRow)
      if (this.rowIndicies[index] === currentRow) {
        // starting row should never be the current selected row itself
        index = directionFn(index, this.rowIndicies.length)
      } else {
        if (direction == 'previous') {
          index--
        }
        if (index < 0) {
          index = this.rowIndicies.length - 1
        } else if (index >= this.rowIndicies.length) {
          index = 0
        } else {
          // continue as index has not reached limits yet
        }
      }
      return index
    },
    updateActiveHotId: function (hotId) {
      this.activeHotId = hotId
    },
    resetOnColumnChange: function () {
      let coords = this.getHotSelection(this.activeHotId)
      if (coords && coords[1] != this.currentCol) {
        this.resetSearchResultWrapper()
      }
    },
    resetSearchResultWrapper: function () {
      // reset can be called for multiple behaviours - ensure don't overwrite with previously reset/null rowIndicies
      if (!_.isEmpty(this.rowIndicies)) {
        _lastRowIndicies = this.rowIndicies
        // hot.render()
        // this.clearPreviousHotSearch(this.activeHotId)
      }
      this.rowIndicies = null
      this.currentCol = null
      this.replaceData.length = 0
      this.inputFoundRemoveFeedback()
      // this turns off feedback functions
      this.clickedFindOrReplace = null
      this.replacesRemaining = -1
      this.updatedRowIndex = -1
    },
    resetRowIndex () {
      this.updatedRowIndex = -1
    }
  }
}
</script>
<style lang="styl" scoped>
    @import '~static/css/findreplace'
</style>
