<template>
<form class="navbar-form form-horizontal" id="findAndReplace">
  <div class="form-group-sm row container-fluid">
    <div  class="propertyrow clearfix" v-for="(formprop, index) in formprops" :key="index">
      <label v-show="formprop.label" v-tooltip.left="tooltip(formprop.tooltipId)" class="control-label pull-left" :for="formprop.label">{{formprop.label}}</label>
      <component :is="formprop.tooltipView"/>
      <div class="inputrow">
        <div class="placeholder text-muted small" :class="formprop.key" :data-placeholder="getResult(formprop.key)">
          <input class="pull-left form-control input-sm col-sm-9" type="text" :id="formprop.key" :value="getText(formprop.key)" @input="setText(formprop.key, $event.target.value)" :name="formprop.key" />
          <span v-show="getResult(formprop.key)" :class="totalFound > 0 ? 'glyphicon-ok' : 'glyphicon-remove'" class="glyphicon form-control-feedback"/>
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
  currentPos$,
  searchChange$
} from '@/rxSubject.js'
// import TableTooltip from '../mixins/TableTooltip'
// import ValidationRules from '../mixins/ValidationRules'
// import {
//   Validator
// } from 'vee-validate'
// import {Sifter} from 'sifter'
Vue.use(AsyncComputed)
Vue.use(VueRx, {
  Subscription
})
let _searchAction = function() {}
let _isInDirection = function() {}
let _currentHotPos = function() {}
let isSameDirectionArrayCalculated = false
let _sameDirectionArray = []
var transform = require('stream-transform')
var Sifter = require('sifter/sifter.min.js')

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
      findTypePicked: 'findInColumn',
      findTextValue: '',
      replaceTextValue: '',
      totalFound: null,
      clickedFindOrReplace: null,
      previousOrNextIndex: -1,
      sameDirectionStartElement: null,
      rowIndicies: null,
      updatedRowIndex: null,
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
        fn: this.findTextPoc
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
    ...mapGetters(['getLatestSearchResult', 'getHotSelection', 'hasHotSearchStarted'])
  },
  methods: {
    ...mapMutations([
      'resetSearchResult', 'incrementSearchResult', 'pushHotSearchStart', 'pushHotSearchEnd'
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
          this.inputFoundSuccessFeedback(key)
          return `${count} of ${this.totalFound}`
          // return `${count} of ${this.totalFound} ${key === 'find' ? 'found' : 'replaced'}`
        } else {
          this.inputFoundFailureFeedback(key)
          return 'No result'
        }
      }
    },
    inputFoundSuccessFeedback: function(key) {
      let element = this.initFeedbackContainer(key)
      element.classList.add('has-success')
    },
    inputFoundFailureFeedback: function(key) {
      let element = this.initFeedbackContainer(key)
      element.classList.add('has-error')
    },
    initFeedbackContainer: function(key) {
      this.inputFoundRemoveFeedback()
      return document.querySelector(`#findAndReplace .placeholder.${key}`)
    },
    inputFoundRemoveFeedback: function() {
      _.forEach(document.querySelectorAll('#findAndReplace .placeholder'), function(el, index) {
        el.classList.remove('has-success')
        el.classList.remove('has-error')
      })
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
        this.replaceAllFindTextWithinCell(hot, selectedCoords[0], selectedCoords[1])
      }
    },
    replaceAllText: function(direction) {
      this.clickedFindOrReplace = 'replace'
      this.findNextOrPrevious(direction)
      const hot = HotRegister.getInstance(this.activeHotId)
      const replaceTextFn = this.replaceAllFindTextWithinCell
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
    replaceAllFindTextWithinCell: function(hot, row, col) {
      let cellText = hot.getDataAtCell(row, col)
      // ensure any special characters in find text are treated as ordinary text
      const escapedFindText = _.escapeRegExp(this.findTextValue)
      const regExp = new RegExp(escapedFindText, 'g')
      let updatedCellText = _.replace(cellText, regExp, this.replaceTextValue)
      hot.setDataAtCell(row, col, updatedCellText)
    },
    replaceEntireCellText: function(hot, row, col) {
      hot.setDataAtCell(row, col, this.replaceTextValue)
    },
    findText: function(direction) {
      this.clickedFindOrReplace = 'find'
      this.findNextOrPrevious(direction)
    },
    previousFn: function(index, arrayLength) {
      console.log(`array length is ${arrayLength}`)
      console.log(`before previous, index is ${index}`)
      index = index >= 0 ? index - 1 : arrayLength - 1
      console.log(`previous index is ${index}`)
      return index
    },
    nextFn: function(index, arrayLength) {
      console.log(`array length is ${arrayLength}`)
      console.log(`before next, index is ${index}`)
      index = index < arrayLength ? index + 1 : 0
      console.log(`next index is ${index}`)
      return index
    },
    findTextPoc: async function(direction) {
      this.clickedFindOrReplace = 'find'
      let directionFn
      if (direction === 'previous') {
        directionFn = this.previousFn
      } else {
        directionFn = this.nextFn
      }
      const hot = HotRegister.getInstance(this.activeHotId)
      if (!hot.hasColHeaders()) {
        throw new Error('Must set headers first')
      }
      this.hotSearch(hot)
      const headers = hot.getColHeader()
      const hotData = hot.getData()
      _currentHotPos = this.getHotSelection(this.activeHotId)
      const currentRow = _currentHotPos[0]
      const currentCol = _currentHotPos[1]
      if (!this.rowIndicies) {
        this.rowIndicies = this.hotSift(hotData, headers)
        this.updatedRowIndex = this.determineStartingRowIndex(currentRow, direction, directionFn)
        console.log(`starting row index: ${this.updatedRowIndex}`)
      } else {
        this.updatedRowIndex = directionFn(this.updatedRowIndex, this.rowIndicies.length)
      }
      // // hot will only put what's in current view into dom - must scroll to put next part of hot into dom
      let updatedRow = this.rowIndicies[this.updatedRowIndex]
      let rowData = hot.getDataAtRow(updatedRow)
      // hot will only put what's in current view into dom - must scroll to put next part of hot into dom
      // hot.scrollViewportTo(updatedRow, 0)
      // const textToMatch = this.findTextValue
      const regExp = new RegExp(this.findTextValue)
      // HOT method too slow (by about 5 times)
      // console.log('starting get col data 1')
      // console.time()
      // let colData = hot.getDataAtCol(currentCol)
      // console.log(colData.length)
      // console.timeEnd()
      console.log('starting get col data 2')
      console.time()
      let colData2 = []
      for (let row of hotData) {
        // let nextRow = {}
        // nextRow[headers[currentCol]] = row[currentCol]
        // colData2.push(nextRow)
        colData2.push([row[currentCol]])
      }
      console.log(colData2)
      console.log(colData2.length)
      let result = this.hotSift(colData2, [headers[currentCol]])
      console.timeEnd()
      console.log('starting get col data 3')
      console.time()
      let colData3 = []
      let currentColName = headers[currentCol]
      for (let row of hotData) {
        let nextRow = {}
        nextRow[currentColName] = row[currentCol]
        colData3.push(nextRow)
        // colData2.push([row[currentCol]])
      }
      console.log(colData3)
      console.log(colData3.length)
      let result3 = this.hotSiftWithoutTransform(colData3, [currentColName])
      console.timeEnd()
      console.log('starting while loop')
      console.time()
      let counter = 0
      while (!regExp.exec(rowData[currentCol])) {
        counter++
        console.log(counter)
        if (counter > this.rowIndicies.length) {
          break
        }
        console.log('looping')
        this.updatedRowIndex = directionFn(this.updatedRowIndex, this.rowIndicies.length)
        updatedRow = this.rowIndicies[this.updatedRowIndex]
        rowData = hot.getDataAtRow(updatedRow)
      }
      console.timeEnd()
      console.log('end time loop')
      hot.scrollViewportTo(updatedRow, currentCol)
      hot.selectCell(updatedRow, currentCol)
      // _.findIndex(rowData, function(cell, index) {
      //   if (regExp.exec(cell)) {
      //     currentMatches.push(index)
      //   }
      // })
      // let matches = _.reduce(rowData, function(currentMatches, cell, index) {
      //   if (regExp.exec(cell)) {
      //     currentMatches.push(index)
      //   }
      //   return currentMatches
      // }, [])
      // { console.log('current matches are at...') }
      // console.log(currentMatches)
      // console.log(matches)
      // now that have indicies of row matches
      // if previous start at first match, if next start at last match in row
      // let startingColIndex
      // if (matches.length > 0) {
      //   let startingMatch = direction == 'previous' ? matches.length - 1 : 0
      //   // let startingColIndex = direction == 'previous' ? _.indexOf(rowData, matches.length - 1)
      // } else {
      //   throw new Error('No matches found in what should have been a matching row.')
      // }
      // console.log(`starting col index: ${startingColIndex}`)
      // hot.selectCell(startingRow, startingColIndex)
    },
    hotSearch: function(hot) {
      console.time()
      // TODO : add loading screen here
      this.pushHotSearchStart(hot.guid)
      hot.search.query(this.findTextValue)
      console.timeEnd()
      console.time()
      hot.render()
      console.timeEnd()
    },
    hotSift: function(data, headers) {
      console.time()
      const transformed = this.transformHotToArrayOfObjects(data, headers)
      console.log(transformed)
      let rowIndicies = this.sift(transformed, headers)
      // sort in ascending order
      rowIndicies.sort(function(a, b) {
        return a - b
      })
      console.timeEnd()
      return rowIndicies
    },
    hotSiftWithoutTransform: function(transformed, headers) {
      // console.time()
      // const transformed = this.transformHotToArrayOfObjects(data, headers)
      // console.log(transformed)
      let rowIndicies = this.sift(transformed, headers)
      // sort in ascending order
      rowIndicies.sort(function(a, b) {
        return a - b
      })
      // console.timeEnd()
      return rowIndicies
    },
    transformHotToArrayOfObjects: function(rows, headers) {
      const mapFn = this.mapArrayToObject
      let result = []
      const transformer = transform(function(row) {
        return mapFn(row, headers)
      })
      transformer.on('readable', function() {
        let row = transformer.read()
        while (row) {
          result.push(row)
          row = transformer.read()
        }
      })
      transformer.on('error', function(err) {
        console.log(err.message)
        transformer.end()
      })
      for (const row of rows) {
        transformer.write(row)
      }
      transformer.end()
      return result
    },
    mapArrayToObject: function(row, headers) {
      let object = _.reduce(row, function(result, value, index) {
        result[headers[index]] = value
        return result
      }, {})
      // console.log(object)
      return object
    },
    // Note: sift will return 1 match for multiple matches in row
    sift: function(hotArrayOfRowObjects, headers) {
      var sifter = new Sifter(hotArrayOfRowObjects)
      console.log(this.findTextValue)
      let result
      if (_.isString(this.findTextValue) && _.trim(this.findTextValue).length > 0) {
        result = sifter.search(this.findTextValue, {
          fields: headers,
          sort: [{field: 'h1', direction: 'desc'}],
          conjunction: 'and'
        })
      }
      console.log(result)
      let ids = []
      for (const item of result.items) {
        ids.push(item.id)
      }
      // console.log(object)
      return ids
    },
    determineStartingRowIndex: function(currentRow, direction, directionFn) {
      let startingRow
      console.log(`current row: ${currentRow}`)
      // let currentRowIndex = _.indexOf(rowIndicies, currentRow)
      // console.log(`current row index: ${currentRowIndex}`)
      let index = _.sortedIndex(this.rowIndicies, currentRow)
      // console.log(`test row index: ${testIndex}`)
      // console.log(`row test index: ${rowIndicies[testIndex]}`)
      if (this.rowIndicies[index] === currentRow) {
        // starting row should never be the current selected row itself
        index = directionFn(index, this.rowIndicies.length)
      } else {
        // let index = _.sortedIndex(rowIndicies, currentRow)
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
        // startingRow = rowIndicies[index]
      }
      return index
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
      console.log('resetting...')
      this.resetSearchResult(this.activeHotId)
      this.removeFoundStyle()
      // on text entry reset current cursor position
      _currentHotPos = this.getHotSelection(this.activeHotId)
      isSameDirectionArrayCalculated = false
      this.sameDirectionStartElement = null
      this.rowIndicies = null
      this.updatedRowIndex = null
    },
    resetTotalFound: function() {
      this.totalFound = null
      this.clickedFindOrReplace = null
      this.inputFoundRemoveFeedback()
    }
  },
  watch: {
  },
  mounted: async function() {
    this.activeHotId = await this.currentHotId()
    const vueUpdateActiveHotId = this.updateActiveHotId
    const vueResetSearchResult = this.resetSearchResultWrapper
    const vueResetTotalFound = this.resetTotalFound
    this.$subscribeTo(hotIdFromTab$, function(hotId) {
      vueUpdateActiveHotId(hotId)
      vueResetSearchResult()
      vueResetTotalFound()
    })
    // this.$subscribeTo(currentPos$, function(currentPos) {
    //   vueResetSearchResult()
    // })
    // this.$subscribeTo(searchChange$, function(value) {
    //   console.log(`search is running: ${value}`)
    // })
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
