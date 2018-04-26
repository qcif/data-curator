<template>
<form class="navbar-form form-horizontal" id="findAndReplace">
  <div class="form-group-sm row container-fluid">
    <div  class="propertyrow clearfix" v-for="(formprop, index) in formprops" :key="index">
      <label v-show="formprop.label" v-tooltip.left="tooltip(formprop.tooltipId)" class="control-label pull-left" :for="formprop.label">{{formprop.label}}</label>
      <component :is="formprop.tooltipView"/>
      <div class="inputrow">
        <div class="placeholder text-muted small" :class="formprop.key" :data-placeholder="formprop.resultFn(formprop.key)">
          <input class="pull-left form-control input-sm col-sm-9" type="text" :id="formprop.key" :value="getText(formprop.key)" @input="setText(formprop.key, $event.target.value)" :name="formprop.key" />
          <span v-show="formprop.resultFn(formprop.key)" :class="formprop.resultIconFn()" class="glyphicon form-control-feedback"/>
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
  afterSetDataAtCell$
} from '@/rxSubject.js'
import Sifter from 'sifter/sifter.min.js'
import transform from 'stream-transform'
Vue.use(AsyncComputed)
Vue.use(VueRx, {
  Subscription
})

let _lastRowIndicies = []
let _currentHotPos = [-1, -1]
let _previousSearchClear = true
const _searchCallback = function(instance, row, col, value, result) {
  if (!_previousSearchClear && _.indexOf(_lastRowIndicies, row) > -1) {
    searchCallback.apply(this, arguments)
  } else if (col === _currentHotPos[1]) {
    searchCallback.apply(this, arguments)
  }
}

export default {
  extends: SideNav,
  name: 'findReplace',
  components: {
  },
  data() {
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
      // foundStyle: {
      //   backgroundColor: 'rgba(70, 237, 70, 0.3)'
      // },
      hotParameters: {
        callback: _searchCallback
      },
      formprops: [{
        label: 'Find in column',
        key: 'find',
        buttonTypeClass: 'btn-primary',
        buttonLeftClass: 'fa fa-chevron-left',
        buttonRightClass: 'fa fa-chevron-right',
        fn: this.findText,
        resultFn: this.findResults,
        resultIconFn: this.getFindResultIcon
      }, {
        label: 'Replace in column',
        key: 'replace',
        buttonTypeClass: 'btn-primary',
        buttonLeftClass: 'fa fa-chevron-left',
        buttonRightClass: 'fa fa-chevron-right',
        // buttonLeftText: 'Replace',
        buttonBelowText: 'Replace All',
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
  methods: {
    getReplaceResultIcon: function() {
      return (this.replacesRemaining > 0) ? 'glyphicon-ok' : 'glyphicon-remove'
    },
    getFindResultIcon: function() {
      return (this.foundCount && this.foundCount.length > 0) ? 'glyphicon-ok' : 'glyphicon-remove'
    },
    findResults: function(key) {
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
    replaceResults: function(key) {
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
      this.foundCounter = -1
      this.foundCount = -1
      this.resetSearchResultWrapper()
      this.clickedFindOrReplace = null
      // wait for the css to update from resetting counters then remove all
      const vueInputFoundRemoveFeedback = this.inputFoundRemoveFeedback
      _.delay(function() {
        vueInputFoundRemoveFeedback()
      }, 10)
    },
    replaceText: function(direction) {
      this.clickedFindOrReplace = 'replace'
      this.replaceMessageText = 'remaining'
      this.findNextOrPrevious(direction)
      const hot = HotRegister.getInstance(this.activeHotId)
      const selectedCoords = hot.getSelected()
      if (selectedCoords) {
        this.replacesRemaining = this.rowIndicies.length
        this.replaceAllFindTextWithinCell(hot, selectedCoords[0], selectedCoords[1])
      }
      this.replacesRemaining--
      this.clickedFindOrReplace = 'replace'
    },
    replaceAllText: function(direction) {
      this.clickedFindOrReplace = 'replace'
      this.replaceMessageText = 'replaced'
      this.findNextOrPrevious(direction)
      this.replacesRemaining = this.rowIndicies.length
      const hot = HotRegister.getInstance(this.activeHotId)
      const replaceTextFn = this.replaceAllFindTextWithinCell
      let replaceCol = this.currentCol
      // console.log(this.rowIndicies.length)
      let data = hot.getData()
      for (let rowIndex of this.rowIndicies) {
        replaceTextFn(data, rowIndex, replaceCol)
      }
      // bulk change data
      hot.loadData(data)
      this.clickedFindOrReplace = 'replace'
    },
    replaceAllFindTextWithinCell: function(data, row, col) {
      let cellText = data[row][col]
      // ensure any special characters in find text are treated as ordinary text
      const escapedFindText = _.escapeRegExp(this.findTextValue)
      const regExp = new RegExp(escapedFindText, 'g')
      let updatedCellText = _.replace(cellText, regExp, this.replaceTextValue)
      data[row][col] = updatedCellText
    },
    previousFn: function(index, arrayLength) {
      // console.log(`array length is ${arrayLength}`)
      // console.log(`before previous, index is ${index}`)
      index = index > 0 ? index - 1 : arrayLength - 1
      // console.log(`previous index is ${index}`)
      return index
    },
    nextFn: function(index, arrayLength) {
      // console.log(`array length is ${arrayLength}`)
      // console.log(`before next, index is ${index}`)
      index = index < arrayLength - 1 ? index + 1 : 0
      // console.log(`next index is ${index}`)
      return index
    },
    findText: function(direction) {
      this.clickedFindOrReplace = 'find'
      this.findNextOrPrevious(direction)
    },
    findNextOrPrevious: function(direction) {
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
      if (!this.rowIndicies || _.isEmpty(this.rowIndicies)) {
        this.clearPreviousHotSearch(hot)
        this.hotSearch(hot)
      }
      let colData = hot.getDataAtCol(currentCol)
      // indexer won't work with a header labelled: 0
      let tempHeader = currentCol + 1
      let colObject = _.map(colData, function(item) {
        return {[tempHeader]: item}
      })
      if (!this.rowIndicies || _.isEmpty(this.rowIndicies) || this.currentCol != currentCol) {
        this.currentCol = currentCol
        // to avoid whether headers are set or not, can just use index for now
        this.rowIndicies = this.hotSiftWithoutTransform(colObject, [tempHeader])
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
      hot.selectCell(updatedRow, currentCol)
      this.rowIndicies = tempRowIndicies
      this.currentCol = currentCol
    },
    hotSearch: function(hot) {
      // TODO : add loading screen here
      hot.search.query(this.findTextValue)
      hot.render()
    },
    clearPreviousHotSearch: function(hot) {
      _previousSearchClear = false
      hot.search.query()
      _previousSearchClear = true
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
      let result
      let ids = []
      if (this.findTextValue) {
        result = sifter.search(this.findTextValue, {
          fields: headers,
          conjunction: 'and'
        })
        for (const item of result.items) {
          ids.push(item.id)
        }
      }
      return ids
    },
    determineStartingRowIndex: function(currentRow, direction, directionFn) {
      let startingRow
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
    updateActiveHotId: function(hotId) {
      this.activeHotId = hotId
    },
    resetSearchResultWrapper: function(hasActiveIdChanged) {
      let newCurrentCol
      let coords = this.getHotSelection(this.activeHotId)
      if (coords) {
        newCurrentCol = coords[1]
      }
      if (hasActiveIdChanged || newCurrentCol != this.currentCol) {
        _lastRowIndicies = this.rowIndicies
        this.rowIndicies = null
        this.currentCol = null
        this.inputFoundRemoveFeedback()
        // this turns off feedback functions
        this.clickedFindOrReplace = null
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
    this.$subscribeTo(afterSetDataAtCell$, function(value) {
      vueResetSearchResult(true)
    })
  }
}
</script>
<style lang="styl" scoped>
@import '~static/css/findreplace'
</style>
