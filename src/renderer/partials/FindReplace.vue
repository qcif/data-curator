<template>
<form class="navbar-form form-horizontal" id="findAndReplace">
  <div class="form-group-sm row container-fluid">
    <div  class="propertyrow clearfix" v-for="(formprop, index) in formprops" :key="index">
      <label v-show="formprop.label" v-tooltip.left="tooltip(formprop.tooltipId)" class="control-label pull-left" :for="formprop.label">{{formprop.label}}</label>
      <component :is="formprop.tooltipView"/>
      <div class="inputrow">
        <div class="placeholder text-muted small" :class="formprop.key" :data-placeholder="getResult(formprop.key)">
          <input class="pull-left form-control input-sm col-sm-9" type="text" :id="formprop.key" :value="getText(formprop.key)" @input="setText(formprop.key, $event.target.value)" :name="formprop.key" />
          <span v-show="getResult(formprop.key)" :class="rowIndicies && rowIndicies.length > 0 ? 'glyphicon-ok' : 'glyphicon-remove'" class="glyphicon form-control-feedback"/>
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
var transform = require('stream-transform')
var Sifter = require('sifter/sifter.min.js')

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
      // totalFound: null,
      clickedFindOrReplace: null,
      // previousOrNextIndex: -1,
      // sameDirectionStartElement: null,
      rowIndicies: null,
      currentCol: null,
      updatedRowIndex: -1,
      updatedCount: -1,
      foundStyle: {
        backgroundColor: 'rgba(70, 237, 70, 0.3)'
      },
      // hotParameters: {
      //   searchResultClass: 'search-result-hot',
      //   callback: _searchCallback,
      //   queryMethod: _queryMethod
      // },
      formprops: [{
        label: 'Find',
        key: 'find',
        buttonTypeClass: 'btn-primary',
        buttonLeftClass: 'fa fa-chevron-left',
        buttonRightClass: 'fa fa-chevron-right',
        fn: this.findNextOrPrevious
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
    getResult: function(key) {
      // show result at either find or replace view
      if (key === this.clickedFindOrReplace) {
        // const count = this.previousOrNextIndex + 1
        const count = this.updatedCount + 1
        if (count >= 1 && this.rowIndicies.length > 0) {
          this.inputFoundSuccessFeedback(key)
          // return `${count} of ${this.totalFound}`
          return `${count} of ${this.rowIndicies.length}`
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
      console.log('updated text')
      if (key === 'find') {
        this.findTextValue = value
      } else {
        this.replaceTextValue = value
      }
      this.resetSearchResultWrapper(true)
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
      _.forEach(document.querySelectorAll('.htSearchResult'), function(el, index) {
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
      index = index > 0 ? index - 1 : arrayLength - 1
      console.log(`previous index is ${index}`)
      return index
    },
    nextFn: function(index, arrayLength) {
      console.log(`array length is ${arrayLength}`)
      console.log(`before next, index is ${index}`)
      index = index < arrayLength - 1 ? index + 1 : 0
      console.log(`next index is ${index}`)
      return index
    },
    findNextOrPrevious: function(direction) {
      this.clickedFindOrReplace = 'find'
      let directionFn
      if (direction === 'previous') {
        directionFn = this.previousFn
      } else {
        directionFn = this.nextFn
      }
      const hot = HotRegister.getInstance(this.activeHotId)
      const currentHotPos = this.getHotSelection(this.activeHotId)
      const currentRow = currentHotPos[0]
      const currentCol = currentHotPos[1]
      if (!this.rowIndicies) {
        this.hotSearch(hot)
      }
      // console.time()
      let colData = hot.getDataAtCol(currentCol)
      let colObject = _.map(colData, function(item) {
        return {[currentCol]: item}
      })
      if (!this.rowIndicies || this.currentCol != currentCol) {
        this.currentCol = currentCol
        this.rowIndicies = this.hotSiftWithoutTransform(colObject, [currentCol])
      }
      if (this.updatedRowIndex >= 0) {
        this.updatedRowIndex = directionFn(this.updatedRowIndex, this.rowIndicies.length)
      } else {
        this.updatedRowIndex = this.determineStartingRowIndex(currentRow, direction, directionFn)
      }
      this.updatedCount = this.updatedRowIndex
      // console.log(`starting row index: ${this.updatedRowIndex}`)
      let updatedRow = this.rowIndicies[this.updatedRowIndex]
      // console.timeEnd()
      // console.time()
      hot.scrollViewportTo(updatedRow, currentCol)
      // preserve rowIndicies and currentCol on reset
      let tempRowIndicies = this.rowIndicies
      hot.selectCell(updatedRow, currentCol)
      this.rowIndicies = tempRowIndicies
      this.currentCol = currentCol
      // console.timeEnd()
    },
    hotSearch: function(hot) {
      // TODO : add loading screen here
      this.pushHotSearchStart(hot.guid)
      hot.search.query(this.findTextValue)
      hot.render()
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
    hotSiftWithoutTransform: function(arrayOfObjects, headers) {
      let rowIndicies = this.sift(arrayOfObjects, headers)
      // sort in ascending order
      rowIndicies.sort(function(a, b) {
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
    sift: function(arrayOfObjects, headers) {
      var sifter = new Sifter(arrayOfObjects)
      // console.log(this.findTextValue)
      let result
      if (this.findTextValue) {
        result = sifter.search(this.findTextValue, {
          fields: headers,
          conjunction: 'and'
        })
      }
      // console.log(result)
      let ids = []
      for (const item of result.items) {
        ids.push(item.id)
      }
      return ids
    },
    determineStartingRowIndex: function(currentRow, direction, directionFn) {
      let startingRow
      // console.log(`current row: ${currentRow}`)
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
    // findNextOrPrevious: function(direction) {
    //   this.totalFound = 0
    //   const hot = HotRegister.getInstance(this.activeHotId)
    //   if (direction === 'previous') {
    //     _isInDirection = this.updateDirection(this.isPrevious)
    //   } else {
    //     _isInDirection = this.updateDirection(this.isNext)
    //   }
    //   hot.search.query(this.findTextValue)
    //   hot.render()
    //   this.initStartingElement(hot)
    //   const foundResultElements = document.querySelectorAll('.search-result-hot')
    //   this.totalFound = foundResultElements.length
    //   const coordsToSelect = this.getPreviousOrNextCoords(foundResultElements)
    //   // capture the index after capturing previous/next element, as element will be reset once selected
    //   this.previousOrNextIndex = this.getPreviousOrNextIndex(foundResultElements)
    //   if (this.previousOrNextIndex > -1) {
    //     hot.selectCell(coordsToSelect.row, coordsToSelect.col)
    //     // must update style after selection as affects style background
    //     this.updateAllFoundStyle(foundResultElements)
    //     this.pickPreviousOrNextElement(foundResultElements, this.previousOrNextIndex)
    //   }
    //   _sameDirectionArray.length = 0
    //   isSameDirectionArrayCalculated = true
    // },
    // initStartingElement: function(hot) {
    //   if (!_.isEmpty(_sameDirectionArray)) {
    //     let sameDirectionStartCoords
    //     if (_isInDirection == this.isPrevious) {
    //       // need to start at the last element of sameDirectionArray
    //       sameDirectionStartCoords = _sameDirectionArray[_sameDirectionArray.length - 1]
    //     } else {
    //       // need to start at first element of sameDirectionArray
    //       sameDirectionStartCoords = _sameDirectionArray[0]
    //     }
    //     this.sameDirectionStartElement = hot.getCell(sameDirectionStartCoords.row, sameDirectionStartCoords.col)
    //   }
    // },
    // getPreviousOrNextIndex: function(foundResultElements) {
    //   let matchingIndex = _.indexOf(foundResultElements, this.sameDirectionStartElement)
    //   if (matchingIndex === -1) {
    //     console.log('Unable to find starting element for find.')
    //   }
    //   return matchingIndex
    // },
    // getPreviousOrNextCoords: function(foundResultElements) {
    //   if (!_.isEmpty(foundResultElements)) {
    //     // current cursor may be beyond limits of previous/next start elements, but there are still result
    //     if (_.isEmpty(_sameDirectionArray) && !this.sameDirectionStartElement) {
    //       if (_isInDirection == this.isPrevious) {
    //         this.sameDirectionStartElement = foundResultElements[foundResultElements.length - 1]
    //       } else {
    //         this.sameDirectionStartElement = foundResultElements[0]
    //       }
    //     }
    //     const hotId = this.activeHotId
    //     const hot = HotRegister.getInstance(hotId)
    //     const coordsToSelect = hot.getCoords(this.sameDirectionStartElement)
    //     return coordsToSelect
    //   }
    // },
    // updateAllFoundStyle: function(foundResultElements) {
    //   const style = this.foundStyle
    //   _.forEach(foundResultElements, function(el, index) {
    //     for (const property of _.keys(style)) {
    //       el.style[property] = style[property]
    //     }
    //   })
    // },
    // pickPreviousOrNextElement: function(foundResultElements, matchingIndex) {
    //   if (_isInDirection == this.isPrevious) {
    //     matchingIndex--
    //     if (matchingIndex < 0) {
    //       matchingIndex = foundResultElements.length - 1
    //     }
    //   } else {
    //     matchingIndex++
    //     if (matchingIndex >= foundResultElements.length) {
    //       matchingIndex = 0
    //     }
    //   }
    //   this.sameDirectionStartElement = foundResultElements[matchingIndex]
    // },
    // updateDirection: function(directionFn) {
    //   if (directionFn != _isInDirection) {
    //     this.resetSearchResultWrapper()
    //   }
    //   return directionFn
    // },
    // removeFoundStyle: function() {
    //   document.querySelectorAll('.search-result-hot').forEach(function(el) {
    //     el.style = {}
    //   })
    // },
    updateActiveHotId: function(hotId) {
      this.activeHotId = hotId
    },
    // incrementSearchResultWrapper: function() {
    //   this.incrementSearchResult(this.activeHotId)
    //   this.totalFound = this.getLatestSearchResult(this.activeHotId)
    // },
    resetSearchResultWrapper: function(hasActiveIdChanged) {
      console.log('checking resetting...')
      if (hasActiveIdChanged || this.getHotSelection(this.activeHotId)[1] != this.currentCol) {
        console.log('resetting...')
        this.rowIndicies = null
        this.currentCol = null
        this.clickedFindOrReplace = null
        this.inputFoundRemoveFeedback()
        this.updatedCount = -1
      }
      this.updatedRowIndex = -1
    }
  },
  mounted: async function() {
    this.activeHotId = await this.currentHotId()
    const vueUpdateActiveHotId = this.updateActiveHotId
    const vueResetSearchResult = this.resetSearchResultWrapper
    this.$subscribeTo(hotIdFromTab$, function(hotId) {
      vueUpdateActiveHotId(hotId)
      vueResetSearchResult(true)
    })
    this.$subscribeTo(currentPos$, function(currentPos) {
      vueResetSearchResult(false)
    })
  }
}
</script>
<style lang="styl" scoped>
@import '~static/css/findreplace'
</style>
