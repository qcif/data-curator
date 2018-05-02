<template>
<div id="home-container" class="panel panel-group">
  <div id="header-panel" class="panel-heading">
    <nav class="navbar navbar-default">
      <div class="container-fluid">
        <div class="navbar-header">
          <a class="navbar-brand"></a>
        </div>
        <div id="toolbar">
          <ul class="nav navbar-nav">
            <li v-for="(menu, index) in toolbarMenus" :key="index" :class="{ 'active': toolbarIndex === index}" @click="updateToolbarMenu(index)">
              <a href="#" v-tooltip="tooltip(menu.tooltipId)">
              <!-- <a href="#"> -->
                <i v-if="menu.icon" class="fa" :class="menu.icon" aria-hidden="true" />
                <object v-if="menu.image" :class="menu.class" :data="menu.image" type="image/svg+xml" />
                <div :id="menu.id" class="toolbar-text">{{menu.name}}</div>
              </a>
              <component :is="menu.tooltipView" />
            </li>
          </ul>
        </div>
      </div>
    </nav>
  </div>
  <div id="body-panel" class="panel">
    <nav id="sidenav" class="sidenav navbar navbar-default row" :class="sideNavProperties">
      <!-- <div> -->
        <div class="navbar-header">
          <ul class="nav navbar-right closebtn">
            <li>
              <a href="#">
                <span v-show="sideNavStatus === 'open'" class="btn-default fa fa-times" @click="closeSideNav" />
              </a>
            </li>
          </ul>
          <a class="navbar-brand" href="#">
            {{sideNavViewTitle}}
          </a>
        </div>
        <transition :name="sideNavTransition" mode="out-in" :css="enableTransition">
          <component ref="sidenavref" :is="sideNavView" :adjustSidenavFormHeight="adjustSidenavFormHeight" :sideNavFormHeight="sideNavFormHeight" :cIndex="currentColumnIndex" :reselectHotCell="reselectHotCell">
          </component>
        </transition>
        <div v-show="sideNavPosition === 'right'" id="sidenav-footer" class="panel-footer row">
          <a v-if="isLeftArrowEnabled" href="#" v-tooltip.left="tooltip('tooltip-previous')" class="left" @click.prevent="sideNavLeft()"><span class="btn fa fa-chevron-left fa-2x" /></a>
          <component v-if="isLeftArrowEnabled" is="tooltipPrevious" />
          <a v-if="isRightArrowEnabled" href="#" v-tooltip.left="tooltip('tooltip-next')" class="right" @click.prevent="sideNavRight()"><span class="btn fa fa-chevron-right fa-2x" /></a>
          <component v-if="isRightArrowEnabled" is="tooltipNext" />
        </div>
    </nav>
    <div id="main-panel" class="panel panel-default" :class="sideNavPropertiesForMain">
      <div id="main-middle-panel" class="panel panel-body" :class="messageStatus">
        <div id='csvEditor'>
          <ul class="nav nav-tabs">
            <li>
              <ul class="nav nav-tabs" id='csvTab'>
                <li v-for="tab in tabs" :id="tab" :key="tab" :class="{active: activeTab == tab}" class="tab-header" @click="setActiveTabWrapper(tab)">
                  <a>
                    <span>{{tabTitle(tab)}}</span>
                    <span v-if="tabs.length > 1" class="tabclose btn-default fa fa-times" @click.stop="closeTab"></span>
                  </a>
                </li>
              </ul>
            </li>
            <li class="tab-add" @click="addTab()" v-tooltip.right="tooltip('tooltip-add-tab')">
              <a>&nbsp;<button type="button" class="btn btn-sm"><i class="fa fa-plus"></i></button></a>
            </li>
            <component is="tooltipAddTab" />
          </ul>
          <div class="tab-content" id='csvContent'>
            <div class="tab-pane" v-for="tab in tabs" :key="tab" :class="{ active: activeTab == tab}">
              <div class="editor">
              </div>
            </div>
          </div>
        </div>
      </div>
      <div id="main-bottom-panel" class="panel-footer" :class="mainBottomPanelStatus">
        <div id="message-panel" class="panel-default">
          <!-- tidy up messages view with components -->
          <div v-show="toggleMessageView()">
            <ul class="nav navbar-right closebtn">
              <li>
                <a href="#" @click="closeMessages()">
                  <span class="btn-default fa fa-times" />
                </a>
              </li>
            </ul>
            <h3 class="message-title">{{messagesTitle}}</h3>
            <template  v-if="messagesType === 'error'">
              <nav class="navbar errors">
                <div class="container-fluid">
                  <i class="navbar-text">{{messages.length}} Error(s)</i>
                  <ul class="nav navbar-nav navbar-left" >
                    <li>
                      <a href="#" v-tooltip.top="tooltip('tooltip-open-errors-window')" @click="openErrorsWindow()">
                        <span class="btn-default fas fa-external-link-alt"/>
                      </a>
                    </li>
                    <component is="tooltipOpenErrorsWindow" />
                    <li>
                      <a href="#" v-tooltip.top="tooltip('tooltip-write-errors-provenance')" @click.prevent="writeErrorsToProvenance()">
                        <object data="static/img/validation-results.svg" type="image/svg+xml" />
                        <!-- <span class="btn-default fas fa-file-alt"  /> -->
                      </a>
                    </li>
                    <component is="tooltipWriteErrorsProvenance" />
                  </ul>
                </div>
              </nav>
              <div class="errors-content">
                <div :id="'error-messages' + index" v-for="(errorMessage, index) in messages" :key="index">
                  <a href="#" @click.prevent="goToCell(errorMessage.rowNumber, errorMessage.columnNumber)"
                    @mouseover="hoverToSelectErrorCell(errorMessage.rowNumber, errorMessage.columnNumber)"
                    @mouseout="exitHoverToSelectErrorCell(errorMessage.rowNumber, errorMessage.columnNumber)">
                  <span v-show="errorMessage.rowNumber">(row:{{errorMessage.rowNumber}})</span>
                  <span v-show="errorMessage.columnNumber">(column:{{errorMessage.columnNumber}})</span>
                  <span>{{errorMessage.message}}</span>
                  </a>
                </div>
              </div>
            </template>
            <div id="other-message" v-else>
                <span>{{messages}}</span>
              </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <div id="footer-panel" class="panel panel-footer">
    <div v-show="loadingDataMessage" class="loading-pane" />
    <div v-show="loadingDataMessage" class="modalHide modal1">
      <span class="glyphicon glyphicon-refresh spinning">
      </span>
      <span class="validation-load">
        {{loadingDataMessage}}
      </span>
    </div>
  </div>
</div>
</template>
<script>
import {
  mapMutations,
  mapState,
  mapGetters
} from 'vuex'
import * as Sortable from 'sortablejs/Sortable.js'
import {
  addHotContainerListeners,
  loadData,
  getWindow
} from '../index.js'
import {
  HotRegister,
  getColumnCount,
  getCurrentColumnIndexOrMin,
  getCurrentColumnIndexOrMax,
  reselectCurrentCellOrMin,
  // incrementColumn,
  // decrementColumn,
  getActiveSelected,
  reselectCellOrMin,
  waitForHotInstance,
  getColumnCountFromInstance,
  getColumnCountFromInstanceId
} from '../hot.js'
import about from '../partials/About'
import preferences from '../partials/Preferences'
import column from '../partials/ColumnProperties'
import tabular from '../partials/TableProperties'
import packager from '../partials/PackageProperties'
import provenance from '../partials/ProvenanceProperties'
import findReplace from '../partials/FindReplace'
import {
  guessColumnProperties,
  validateActiveDataAgainstSchema
} from '../frictionless.js'
import {createDataPackage} from '@/frictionlessDataPackage.js'
import HomeTooltip from '../mixins/HomeTooltip'
import ErrorsTooltip from '../mixins/ErrorsTooltip'
import {
  fileFormats
} from '../file-formats.js'
import {ipcRenderer as ipc} from 'electron'
import 'lodash/lodash.min.js'
import {unzipFile} from '@/importPackage.js'
import {toggleHeaderWithFeedback} from '@/headerRow.js'
import {onNextHotIdFromTabRx, hotIdFromTab$, provenanceErrors$} from '@/rxSubject.js'
import VueRx from 'vue-rx'
import {
  Subscription
} from 'rxjs/Subscription'
import {getHotIdFromTabIdFunction} from '@/store/modules/hots.js'
import {isCaseSensitive} from '@/frictionlessUtilities'
import Handsontable from 'handsontable/dist/handsontable.full.min.js'
import AsyncComputed from 'vue-async-computed'
import Vue from 'vue'
Vue.use(AsyncComputed)
Vue.use(VueRx, {
  Subscription
})
export default {
  name: 'home',
  mixins: [HomeTooltip, ErrorsTooltip],
  asyncComputed: {
    isLeftArrowEnabled: {
      async get() {
        return this.sideNavView === 'column' && this.currentColumnIndex > 0
      }
    },
    isRightArrowEnabled: {
      async get() {
        let columnCount = getColumnCount()
        if (columnCount) {
          return this.sideNavView === 'column' && this.currentColumnIndex < columnCount - 1
        }
      },
      watch() {
        let temp = this.currentColumnIndex
        let temp2 = this.sideNavView
      }
    }
  },
  data() {
    return {
      currentHotId: '',
      currentColumnIndex: 0,
      toolbarIndex: -1,
      sideNavPosition: 'right',
      sideNavStatus: 'closed',
      sideNavView: '',
      sideNavViewTitle: '',
      sideNavTransition: '',
      enableTransition: false,
      // enableSideNavLeftArrow: true,
      // enableSideNavRightArrow: true,
      messagesType: '',
      messages: false,
      messagesTitle: 'Feedback',
      loadingDataMessage: false,
      sideNavFormHeight: '300px',
      widthInner1: null,
      widthMain1: null,
      heightInner1: null,
      heightMain1: null,
      panelWidthDiff: null,
      panelHeightDiff: null,
      previousComments: [],
      errorsWindowId: null,
      activeSelected: [],
      persistColorFn: this.highlightPersistedSelection,
      toolbarMenus: [{
        name: 'Guess',
        id: 'guess-column-properties',
        image: 'static/img/guess-column-properties.svg',
        tooltipId: 'tooltip-guess',
        tooltipView: 'tooltipGuess'
      },
      {
        name: 'Column',
        id: 'column-properties',
        image: 'static/img/column-properties.svg',
        tooltipId: 'tooltip-column',
        tooltipView: 'tooltipColumn',
        sideNavPosition: 'right',
        sideNavView: 'column'
      },
      {
        name: 'Table',
        id: 'table-properties',
        image: 'static/img/table-properties.svg',
        tooltipId: 'tooltip-table',
        tooltipView: 'tooltipTable',
        sideNavPosition: 'right',
        sideNavView: 'tabular'
      },
      {
        name: 'Provenance',
        id: 'provenance-information',
        image: 'static/img/provenance-information.svg',
        tooltipId: 'tooltip-provenance',
        tooltipView: 'tooltipProvenance',
        sideNavPosition: 'right',
        sideNavView: 'provenance'
      },
      {
        name: 'Package',
        id: 'data-package-properties',
        image: 'static/img/data-package-properties.svg',
        tooltipId: 'tooltip-package',
        tooltipView: 'tooltipPackage',
        sideNavPosition: 'right',
        sideNavView: 'packager'
      },
      {
        name: 'Validate',
        id: 'validate-data',
        image: 'static/img/validate.svg',
        tooltipId: 'tooltip-validate',
        tooltipView: 'tooltipValidate'
      },
      {
        name: 'Find and Replace',
        id: 'find',
        image: 'static/img/find.svg',
        tooltipId: 'tooltip-find',
        tooltipView: 'tooltipFind',
        sideNavPosition: 'left',
        sideNavView: 'findReplace'
      },
      {
        name: 'Export',
        id: 'export-package',
        image: 'static/img/export.svg',
        tooltipId: 'tooltip-export',
        tooltipView: 'tooltipExport',
        sideNavView: 'export'
      }
      ],
      defaultTableProperties: {
        profile: 'tabular-data-resource',
        format: 'csv',
        mediatype: 'text/csv',
        encoding: 'utf-8'
      },
      defaultPackageProperties: [{
        key: 'profile',
        value: 'tabular-data-package'
      }],
      reportSiblingClasses: ['main-bottom-panel', 'main-middle-panel']
    }
  },
  computed: {
    ...mapGetters({
      tabs: 'getTabs',
      activeTab: 'getActiveTab',
      tabIndex: 'getTabIndex'
    }),
    ...mapGetters(['getPreviousTabId', 'tabTitle', 'getHotIdFromTabId', 'getHotSelection']),
    sideNavPropertiesForMain() {
      return this.sideNavStatus === 'closed' ? this.sideNavStatus : this.sideNavPosition
    },
    sideNavProperties() {
      return `${this.sideNavStatus} ${this.sideNavPosition}`
    },
    toolbarMenuName() {
      return _.get(this.toolbarMenus[this.toolbarIndex], 'name')
    },
    messageStatus() {
      return this.messages ? 'messages-opened' : 'messages-closed'
    },
    mainBottomPanelStatus() {
      return `${this.messageStatus} ${this.sideNavPropertiesForMain}`
    },
    errorColor() {
      return 'rgba(245, 186, 186, 0.3)'
    },
    highlightColor() {
      return 'rgba(181, 209, 255, 0.3)'
    }
  },
  methods: {
    ...mapMutations([
      'pushTab',
      'pushHotTab',
      'removeTab',
      'setTabsOrder',
      'setActiveTab',
      'incrementTabIndex',
      'decrementTabIndex',
      'pushHotColumns',
      'pushTabTitle',
      'pushTabObject',
      'destroyHotTab',
      'destroyTabObject',
      'resetPackagePropertiesToObject',
      'resetTablePropertiesToObject',
      'resetColumnPropertiesToObject',
      'pushTableProperty',
      'pushPackageProperty',
      'pushHotSelection',
      'pushProvenanceErrors'
    ]),
    saveHotPanelDimensions: function() {
      this.widthInner1 = document.querySelector('.ht_master .wtHolder').offsetWidth
      this.heightInner1 = document.querySelector('.ht_master .wtHolder').offsetHeight
    },
    saveMainMiddlePanelDimensions: function() {
      this.widthMain1 = document.querySelector('#main-middle-panel').offsetWidth
      this.heightMain1 = document.querySelector('.ht_master .wtHolder').offsetHeight
    },
    calculatePanelDiff: function() {
      this.panelWidthDiff = this.widthMain1 - this.widthInner1
      this.panelHeightDiff = this.heightMain1 - this.heightInner1
      // console.log(`panel diff: ${this.panelWidthDiff}`)
      // console.log(`panel diff: ${this.panelHeightDiff}`)
    },
    testSideMain: function() {
      // TODO : refactor this as an event that plays once only rather than a continuous condition-check
      if (!this.widthInner1 && !this.widthMain1 & !this.panelWidthDiff) {
        this.saveMainMiddlePanelDimensions()
        this.saveHotPanelDimensions()
        this.calculatePanelDiff()
      }
      // console.log(`diff: ${this.panelWidthDiff}`)
      let panelWidthDiff = this.panelWidthDiff
      window.setTimeout(function() {
        document.querySelectorAll('.ht_master .wtHolder').forEach((el) => {
          let width1 = document.querySelector('#main-middle-panel').offsetWidth
          let updatedInner = width1 - panelWidthDiff
          // el.style.width = `${updatedInner - 15}px`
          el.style.width = `${updatedInner}px`
        })
      }, 500)
    },
    testBottomMain: function() {
      // TODO : refactor this as an event that plays once only rather than a continuous condition-check
      if (!this.heightInner1 && !this.heightMain1 & !this.panelHeightDiff) {
        this.saveMainMiddlePanelDimensions()
        this.saveHotPanelDimensions()
        this.calculatePanelDiff()
      }
      // console.log(`diff: ${this.panelHeightDiff}`)
      let panelHeightDiff = this.panelHeightDiff
      window.setTimeout(function() {
        document.querySelectorAll('.ht_master .wtHolder').forEach((el) => {
          let height1 = document.querySelector('#main-middle-panel').offsetHeight
          let updatedInner = height1 - panelHeightDiff
          el.style.height = `${updatedInner}px`
        })
      }, 500)
    },
    hoverToSelectErrorCell: function(row, column) {
      this.persistColorFn = false
      this.updateCellsFromCount(row, column, this.addErrorHoverStyle)
    },
    exitHoverToSelectErrorCell: function(row, column) {
      this.updateCellsFromCount(row, column, this.removeErrorHoverStyle)
      this.persistColorFn = this.highlightPersistedSelection
    },
    addErrorHoverStyle: function(element) {
      element.style.border = 'solid 1px #ff3860'
      element.style.outline = 'solid 1px #ff3860'
      element.style.boxShadow = '1px 1px 5px #999'
    },
    removeErrorHoverStyle: function(element) {
      element.style.border = ''
      element.style.outline = ''
      element.style.boxShadow = ''
    },
    addErrorHighlightStyle: function(element) {
      element.style.backgroundColor = this.errorColor
    },
    removeErrorHighlightStyle: function(element) {
      element.style.backgroundColor = ''
    },
    highlightPersistedSelection: function(hot) {
      let element = this.getHotSelectionElement(hot)
      // only highlight if no existing color
      if (element) {
        element.style.backgroundColor = this.highlightColor
      }
    },
    unhighlightPersistedSelection: function(hot) {
      let element = this.getHotSelectionElement(hot)
      // only remove color if it is 'highlight'
      if (element) {
        if (element.style && element.style.backgroundColor === this.highlightColor) {
          element.style.backgroundColor = ''
        }
      }
    },
    getHotSelectionElement: function(hot) {
      let element
      let selection = this.getHotSelection(hot.guid)
      if (selection) {
        element = hot.getCell(selection[0], selection[1])
      }
      return element
    },
    updateCellsFromCount: function(row, column, fn) {
      let hot = HotRegister.getActiveInstance()
      let range = this.getCellOrRowFromCount(hot, row, column)
      this.updateCellsFromHotRange(hot, range, fn)
    },
    updateCellsFromIndex: function(row, column, fn) {
      let hot = HotRegister.getActiveInstance()
      let range = this.getCellOrRowFromIndex(hot, row, column)
      this.updateCellsFromHotRange(hot, range, fn)
    },
    updateCellsFromHotRange: function(hot, range, fn) {
      // before we select cell for errors, check if there is a current selection made
      hot.selectCell(range.from.row, range.from.col, range.to.row, range.to.col)
      let elements = this.getHighlightedAreaOrCellSelectors()
      hot.deselectCell()
      for (let element of elements) {
        fn(element)
      }
      // hot.deselectCell()
    },
    getHighlightedAreaOrCellSelectors: function() {
      let elements = document.querySelectorAll('.highlight')
      return elements
    },
    goToCell: function(row, column) {
      let hot = HotRegister.getActiveInstance()
      let rowIndex = this.transformCountToIndex(row)
      let columnIndex = this.transformCountToIndex(column)
      hot.selectCell(rowIndex, columnIndex)
    },
    deselectionListener: function() {
      let hot = HotRegister.getActiveInstance()
      if (this.persistColorFn) {
        this.persistColorFn(hot)
      }
    },
    selectionListener: function() {
      let hot = HotRegister.getActiveInstance()
      this.unhighlightPersistedSelection(hot)
      let selected = hot.getSelected()
      // with deselectOutsideHot set to true, we need to track last selection.
      this.pushHotSelection({hotId: hot.guid, selected: selected})
      this.updateActiveColumn(selected)
    },
    inferColumnProperties: async function() {
      try {
        this.messages = await guessColumnProperties()
        this.messagesType = 'feedback'
        this.messagesTitle = 'Guess column properties'
      } catch (err) {
        console.log(err)
      }
    },
    // TODO: tidy up message objects
    reportValidationRowErrors: function(errorCollection) {
      if (errorCollection.length > 0) {
        this.messagesTitle = 'Validation Errors'
        this.messages = errorCollection
        this.messagesType = 'error'
      } else {
        this.messagesTitle = 'Validation Success'
        this.messages = 'No validation errors reported.'
        this.messagesType = 'feedback'
      }
    },
    validateTable: async function() {
      try {
        await validateActiveDataAgainstSchema(this.reportValidationRowErrors)
      } catch (err) {
        console.log('There was an error(s) validating table.', err)
      }
    },
    storeResetCallback: function(allProperties) {
      this.resetPackagePropertiesToObject(allProperties.package)
      this.resetTablePropertiesToObject(allProperties.tables)
      this.resetColumnPropertiesToObject(allProperties.columns)
    },
    importDataPackage: async function(filename, isTransient) {
      let message = await unzipFile(filename, this.storeResetCallback, isTransient)
      this.messagesTitle = message ? 'Open Data Package Error' : 'Open Data Package Success'
      this.messages = message || 'All Properties have been imported.'
      this.messagesType = 'feedback'
    },
    exportPackageFeedback: function() {
      this.messagesTitle = 'Export package success'
      this.messages = 'Data package created.'
      this.messagesType = 'feedback'
    },
    exportPackageErrors: function(errorMessages) {
      this.messagesTitle = 'Export package error'
      this.messages = errorMessages
      this.messagesType = 'error'
    },
    createPackage: async function() {
      try {
        let messages = await createDataPackage()
        if (messages.length > 0) {
          this.exportPackageErrors(messages.map(x => {
            return {message: x}
          }))
        } else {
          this.exportPackageFeedback()
        }
      } catch (err) {
        console.log('There was an error creating a data package.', err)
      }
    },
    latestHotContainer: function() {
      let allEditors = document.querySelectorAll('#csvContent .editor')
      return allEditors[allEditors.length - 1]
    },
    addTabWithFilename: function(data, format, filename, descriptor={}) {
      this.createHotDataContainer(data, format, descriptor)
      this.$nextTick(function() {
        this.pushTabObject({id: this.activeTab, filename: filename})
      })
    },
    addTab: function(data = '"","",""', format, descriptor) {
      console.log('adding tab...')
      console.log(data)
      console.log(format)
      console.log(descriptor)
      this.createHotDataContainer(data, format, descriptor)
    },
    setActiveTabWrapper: function(tabId) {
      let hot = HotRegister.getActiveInstance()
      if (hot) {
        hot.deselectCell()
      }
      this.setActiveTab(tabId)
    },
    showLoadingScreen: function(message) {
      this.loadingDataMessage = message
    },
    closeLoadingScreen: function() {
      this.loadingDataMessage = false
    },
    createHotDataContainer: function(data, format={}, descriptor={}) {
      this.initTab()
      let vueLatestHotContainer = this.latestHotContainer
      this.$nextTick(function() {
        this.registerContainer(vueLatestHotContainer())
        const updatedFormat = this.mergeOntoCsvFormat(format)
        const hotId = this.loadDataIntoLatestHot(data, updatedFormat)
        this.initHotTablePropertiesFromDescriptor(hotId, descriptor)
        this.initHotColumnPropertiesFromSchema(hotId, descriptor.schema)
      })
    },
    initTab: function() {
      this.incrementTabIndex()
      let nextTabId = this.createTabId(this.tabIndex)
      this.pushTabTitle({
        id: nextTabId,
        index: this.tabIndex
      })
      // activeRxTab.next(tabId)
      this.setActiveTabWrapper(nextTabId)
      this.pushTab(nextTabId)
    },
    registerContainer: function(container) {
      HotRegister.register(container, {
        selectionListener: this.selectionListener,
        deselectionListener: this.deselectionListener,
        loadingStartListener: this.showLoadingScreen,
        loadingFinishListener: this.closeLoadingScreen
      }, findReplace.data().hotParameters
      )
      addHotContainerListeners(container)
    },
    mergeOntoCsvFormat: function(format) {
      let defaultFormat = _.assign({}, fileFormats.csv)
      let updatedFormat = _.assign(defaultFormat, format)
      return updatedFormat
    },
    loadDataIntoLatestHot: function(data, format) {
      let hot = HotRegister.getActiveInstance()
      let activeHotId = hot.guid
      let activeTabId = this.activeTab
      // hack! - force data to wait for latest render e.g, for loader message
      window.setTimeout(function() {
        loadData(activeHotId, data, format)
        getCurrentColumnIndexOrMin()
      }, 1)
      this.pushHotTab({
        'hotId': activeHotId,
        'tabId': activeTabId
      })
      return activeHotId
    },
    initHotTablePropertiesFromDescriptor: function(hotId, descriptor) {
      let tableProperties = _.assign({}, this.defaultTableProperties, descriptor)
      _.unset(tableProperties, 'schema')
      for (let property in descriptor.schema) {
        if (property !== 'fields') {
          tableProperties[property] = descriptor.schema[property]
        }
      }
      let tableHotIdProperties = {}
      tableHotIdProperties[hotId] = tableProperties
      this.resetTablePropertiesToObject(tableHotIdProperties)
    },
    initHotColumnPropertiesFromSchema: function(hotId, schema) {
      // TODO : move this to similar logic in importDataPackage to tidy up
      if (!_.isEmpty(schema)) {
        let columnHotIdProperties = {}
        columnHotIdProperties[hotId] = [...schema.fields]
        this.resetColumnPropertiesToObject(columnHotIdProperties)
      }
    },
    pushDefaultPackageProperties: function() {
      this.defaultPackageProperties.forEach(x => {
        this.pushPackageProperty({key: x.key, value: x.value})
      })
    },
    closeTab: async function(event) {
      // do not allow single tab to be closed
      if (this.tabs.length > 1) {
        let targetTabId = event.currentTarget.closest('.tab-header').id
        this.removeTab(targetTabId)
        await this.cleanUpTabDependencies(targetTabId)
      }
    },
    cleanUpTabDependencies: async function(tabId) {
      // update active tab
      if (tabId === this.activeTab) {
        let targetTabIndex = _.indexOf(this.tabs, tabId)
        let previousTabId = this.getPreviousTabId(targetTabIndex)
        this.setActiveTabWrapper(previousTabId)
      }
      this.destroyTabObject(tabId)
      let hotId = await this.getHotIdFromTabId(tabId)
      this.destroyHotTab(hotId)
      HotRegister.destroyHot(hotId)
    },
    closeSideNav: function() {
      this.enableTransition = false
      this.sideNavStatus = 'closed'
      if (this.sideNavView == 'findReplace') {
        ipc.send('closedFindReplace')
      }
      this.sideNavView = ''
    },
    openSideNav: function() {
      this.sideNavStatus = 'open'
      // ensure sidenav menu is rendered before adjusting form height
      const vueAdjustSidenavFormHeight = this.adjustSidenavFormHeight
      _.delay(function() {
        vueAdjustSidenavFormHeight()
      }, 100)
    },
    updateTransitions: function(index) {
      if (index < this.toolbarIndex) {
        this.sideNavTransition = 'sideNav-left'
      } else if (index > this.toolbarIndex) {
        this.sideNavTransition = 'sideNav-right'
      } else {
        // ('same toolbar selection...')
      }
    },
    isSideNavToolbarMenu: function(index) {
      let toolbarMenu = this.toolbarMenus[index]
      return toolbarMenu.sideNavPosition && toolbarMenu.sideNavView
    },
    updateSideNavState: function() {
      let toolbarMenu = this.toolbarMenus[this.toolbarIndex]
      if (toolbarMenu) {
        this.sideNavPosition = toolbarMenu.sideNavPosition
        this.sideNavView = toolbarMenu.sideNavView
        if (this.sideNavView !== 'findReplace') {
          ipc.send('closedFindReplace')
        } else {
          ipc.send('openedFindReplace')
        }
        this.sideNavViewTitle = toolbarMenu.name
        this.openSideNav()
      }
    },
    updateToolbarMenuForSideNav: function(index) {
      let menuName
      if (index !== -1) {
        menuName = this.toolbarMenus[index].name
      }
      if (this.sideNavStatus === 'closed') {
        this.enableTransition = false
      } else if (this.sideNavPosition === 'left' && (index !== -1 && menuName !== 'Find and Replace')) {
        this.enableTransition = false
      } else if (this.sideNavPosition === 'right' && (index === -1 || menuName === 'Find and Replace')) {
        this.enableTransition = false
      } else {
        this.updateTransitions(index)
        this.enableTransition = true
      }
      this.toolbarIndex = index
      this.updateSideNavState()
    },
    findMenuByName: function(name) {
      return this.toolbarMenus.find(x => x.name === name)
    },
    findMenuBySideNavView: function(sideNavView) {
      return this.toolbarMenus.find(x => typeof x.sideNavView !== 'undefined' && x.sideNavView === sideNavView)
    },
    updateActiveColumn: function(selected) {
      if (selected) {
        this.currentColumnIndex = selected[1]
      } else {
        console.log('Cannot update active column without a column selected.')
      }
    },
    updateToolbarMenuForButton: function(index) {
      this.toolbarIndex = index
      // this.closeSideNav()
      switch (this.toolbarMenus[index].name) {
        case 'Validate':
          this.validateTable()
          break
        case 'Export':
          this.createPackage()
          break
        case 'Guess':
          this.inferColumnProperties()
          break
        default:
          console.log(`Error: No case exists for menu index: ${index}`)
      }
    },
    updateToolbarMenu: function(index) {
      if (this.isSideNavToolbarMenu(index)) {
        this.updateToolbarMenuForSideNav(index)
      } else {
        this.updateToolbarMenuForButton(index)
      }
      this.reselectHotCell()
    },
    sideNavLeft: function() {
      let activeHot = HotRegister.getActiveInstance()
      let selection = this.getHotSelection(activeHot.guid)
      activeHot.selectCell(selection[0], selection[1] - 1)
    },
    sideNavRight: function() {
      let activeHot = HotRegister.getActiveInstance()
      let selection = this.getHotSelection(activeHot.guid)
      activeHot.selectCell(selection[0], selection[1] + 1)
    },
    createTabId: function(tabId) {
      return `tab${tabId}`
    },
    triggerSideNav: function(properties) {
      const menu = this.findMenuBySideNavView(properties.sideNavView)
      if (menu) {
        this.triggerMenuButton(menu.name)
      } else {
        this.updateToolbarMenuForSideNav(-1)
        // Find is a menu button so ensure closed signal fires
        ipc.send('closedFindReplace')
        this.sideNavPosition = properties.sideNavPosition || 'left'
        this.sideNavView = properties.sideNavView
        this.sideNavViewTitle = properties.title || properties.sideNavView
        this.openSideNav()
      }
    },
    triggerMenuButton: function(menuName) {
      let index = _.findIndex(this.toolbarMenus, function(o) {
        return o.name.toLowerCase() === menuName.toLowerCase()
      })
      this.updateToolbarMenu(index)
    },
    forceWrapper: function() {
      this.$forceUpdate()
    },
    adjustSidenavFormHeight: function() {
      let sidenav = document.querySelector('#sidenav')
      let sidenavHeight = sidenav.clientHeight
      let form = sidenav.querySelector('form')
      this.sideNavFormHeight = (sidenavHeight - 150) + 'px'
      if (form) {
        form.style.height = this.sideNavFormHeight
      }
    },
    toggleHeader: function() {
      let hot = HotRegister.getActiveInstance()
      toggleHeaderWithFeedback(hot, this.addHeaderErrorMessage, this.removeHeaderErrorMessage)
    },
    addHeaderErrorMessage: function() {
      this.messagesTitle = 'Header Error'
      this.messages = 'At least 2 rows are required before a header row can be set.'
      this.messagesType = 'feedback'
    },
    removeHeaderErrorMessage: function() {
      if (this.messagesTitle === 'Header Error') {
        this.closeMessages()
      }
    },
    removePreviousHotComments: function(commentsPlugin) {
      for (const previousComment of this.previousComments) {
        commentsPlugin.removeCommentAtCell(previousComment.row, previousComment.col)
        this.updateCellsFromIndex(previousComment.row, previousComment.col, this.removeErrorHighlightStyle)
      }
      this.previousComments = []
    },
    setHotComments: function(commentsPlugin, hot) {
      for (const errorMessage of this.messages) {
        let range = this.getCellOrRowFromCount(hot, errorMessage.rowNumber, errorMessage.columnNumber)
        commentsPlugin.setRange(range)
        commentsPlugin.setComment(errorMessage.message)
        this.previousComments.push({row: range.from.row, col: range.from.col})
        // wait for hot to update cells with comment class
        _.delay(this.updateCellsFromHotRange, 100, hot, range, this.addErrorHighlightStyle)
      }
    },
    getCellOrRowFromCount: function(hot, row, column) {
      let rowIndex = this.transformCountToIndex(row)
      let columnFromIndex
      let columnToIndex
      if (typeof column !== 'number') {
        columnFromIndex = 0
        columnToIndex = this.transformCountToIndex(hot.countCols())
      } else {
        columnToIndex = this.transformCountToIndex(column)
        columnFromIndex = columnToIndex
      }
      return {from: {col: columnFromIndex, row: rowIndex}, to: {col: columnToIndex, row: rowIndex}}
    },
    getCellOrRowFromIndex: function(hot, rowIndex, columnIndex) {
      let columnFromIndex
      let columnToIndex
      if (typeof columnIndex !== 'number') {
        columnFromIndex = 0
        columnToIndex = this.transformCountToIndex(hot.countCols())
      } else {
        columnToIndex = columnIndex
        columnFromIndex = columnToIndex
      }
      return {from: {col: columnFromIndex, row: rowIndex}, to: {col: columnToIndex, row: rowIndex}}
    },
    // handsontable mark row/col indexes, whereas frictionless mark row/col count
    transformCountToIndex: function(count) {
      let index = 0
      if (typeof count === 'number' && count > 0) {
        index = count - 1
      }
      return index
    },
    focusOnWindow: function() {
      ipc.send('focusMainWindow')
    },
    packErrorMessages: function() {
      return {title: this.messagesTitle, messages: this.messages}
    },
    closeMessages: function() {
      this.messages = false
      this.messagesType = ''
      this.messageTitle = ''
    },
    closeMessagePanel: function() {
      this.errorsWindowId = null
    },
    toggleMessageView: function() {
      if (this.messagesType === 'error' && getWindow('errors')) {
        return false
      }
      return this.messages
    },
    openErrorsWindow: async function() {
      await ipc.send('showErrorsWindow')
    },
    sendErrorsToErrorsWindow: function() {
      const browserWindow = getWindow('errors')
      if (browserWindow) {
        if (this.messages && this.messagesType === 'error') {
          browserWindow.webContents.send('errorMessages', this.packErrorMessages())
        } else {
          browserWindow.webContents.send('errorMessages')
        }
        // messages are to appear in 1 window or the other, not both
        this.closeMessages()
      }
    },
    reselectHotCell: function() {
      let hot = HotRegister.getActiveInstance()
      let selection = this.getHotSelection(hot.guid)
      if (selection) {
        hot.selectCell(selection[0], selection[1], selection[2], selection[3])
      }
    },
    writeErrorsToProvenance: function() {
      this.pushProvenanceErrors(this.messages)
      this.showProvenanceErrors()
    },
    showProvenanceErrors: function() {
      this.updateToolbarMenu(3)
      provenanceErrors$.next()
    }
  },
  components: {
    about,
    preferences,
    column,
    tabular,
    packager,
    provenance,
    findReplace
  },
  watch: {
    activeTab: async function(tabId) {
      try {
        let hotId = await this.getHotIdFromTabId(tabId)
        this.currentHotId = hotId
        // reselectCellOrMin(hotId)
        this.reselectHotCell()
      } catch (err) {
        console.log('Problem with getting hot id from watched tab', err)
      }
      this.closeMessages()
      this.sendErrorsToErrorsWindow()
    },
    sideNavPropertiesForMain: function() {
      this.testSideMain()
    },
    messageStatus: function() {
      this.testBottomMain()
    },
    messages: function() {
      let hot = HotRegister.getActiveInstance()
      let commentsPlugin = hot.getPlugin('comments')
      this.removePreviousHotComments(commentsPlugin)
      if (this.messagesType === 'error') {
        this.setHotComments(commentsPlugin, hot)
      }
      if (this.messages) {
        this.sendErrorsToErrorsWindow()
      }
    }
  },
  mounted: function() {
    const vueGoToCell = this.goToCell
    const vueNextTick = this.$nextTick
    // request may be coming from another page - get focus first
    ipc.on('showErrorCell', async function(event, arg) {
      await ipc.send('focusMainWindow')
      // ensure cell select occurs after main window focus
      _.delay(function(arg) {
        vueGoToCell(arg.row, arg.column)
      }, 100, arg)
    })
    const vueSendErrorsToErrorsWindow = this.sendErrorsToErrorsWindow
    ipc.on('getErrorMessages', function(event, arg) {
      vueSendErrorsToErrorsWindow()
    })
    const vueHoverToSelectErrorCell = this.hoverToSelectErrorCell
    ipc.on('hoverToSelectErrorCell', function(event, arg) {
      vueHoverToSelectErrorCell(arg.rowNumber, arg.columnNumber)
    })
    const vueExitHoverToSelectErrorCell= this.exitHoverToSelectErrorCell
    ipc.on('exitHoverToSelectErrorCell', function(event, arg) {
      vueExitHoverToSelectErrorCell(arg.rowNumber, arg.columnNumber)
    })
    const vueTriggerMenuButton = this.triggerMenuButton
    ipc.on('triggerMenuButton', function(event, arg) {
      vueTriggerMenuButton(arg)
    })
    const vueToggleHeader = this.toggleHeader
    ipc.on('toggleActiveHeaderRow', function() {
      vueToggleHeader()
    })
    const vueAddTab = this.addTab
    ipc.on('addTab', function() {
      vueAddTab()
    })
    ipc.on('addTabWithData', function(e, data) {
      vueAddTab(data)
    })
    ipc.on('addTabWithFormattedData', function(e, data, format) {
      vueAddTab(data, format)
    })
    ipc.on('addTabWithFormattedDataAndDescriptor', function(e, data, format, descriptor) {
      vueAddTab(data, format, descriptor)
    })
    const vueAddTabWithFilename = this.addTabWithFilename
    ipc.on('addTabWithFormattedDataFile', function(e, data, format, filename) {
      vueAddTabWithFilename(data, format, filename)
    })
    const vueTriggerSideNav = this.triggerSideNav
    ipc.on('showSidePanel', function(event, arg) {
      vueTriggerSideNav({
        sideNavView: arg
      })
    })
    const vueForceUpdate = this.forceWrapper
    ipc.on('saveDataSuccess', function(e, format, fileName) {
      vueForceUpdate()
    })
    const vueAdjustSidenavFormHeight = this.adjustSidenavFormHeight
    ipc.on('resized', function() {
      vueAdjustSidenavFormHeight()
      let hot = HotRegister.getActiveInstance()
      hot.render()
    })
    this.$nextTick(function() {
      require('../index.js')
      const vueSetTabsOrder = this.setTabsOrder
      Sortable.create(csvTab, {
        animation: 150,
        onSort: function(evt) {
          let tabIdOrder = []
          document.querySelectorAll('#csvTab .tab-header').forEach((el) => {
            tabIdOrder.push(el.id)
          })
          vueSetTabsOrder(tabIdOrder)
        }
      })
      this.closeSideNav()
      this.addTab()
    })
    const vueShowProvenanceErrors = this.showProvenanceErrors
    ipc.on('showProvenanceErrors', function(event, arg) {
      vueShowProvenanceErrors()
    })
    const vueShowLoadingScreen = this.showLoadingScreen
    const vueCloseLoadingScreen = this.closeLoadingScreen
    ipc.on('closeAndshowLoadingScreen', function(event, message) {
      vueCloseLoadingScreen()
      vueShowLoadingScreen(message)
    })
    ipc.on('closeLoadingScreen', function(event, isReplyRequired = false) {
      vueCloseLoadingScreen()
      if (isReplyRequired) {
        ipc.sendSync('loadingScreenIsClosed')
      }
    })
    const vueResetPackagePropertiesToObject = this.resetPackagePropertiesToObject
    ipc.on('resetPackagePropertiesToObject', function(event, packageProperties) {
      vueResetPackagePropertiesToObject(packageProperties)
    })
  },
  beforeCreate: function() {
    this.$subscribeTo(hotIdFromTab$, function(hotId) {
      let hot = HotRegister.getInstance(hotId)
      // hot.updateSettings({outsideClickDeselects: false})
      // FOR testing: https://github.com/ODIQueensland/data-curator/issues/387
      // let plugin = hot.getPlugin('autoRowSize')
      // console.log(`sync calc: ${plugin.getSyncCalculationLimit()}`)
      // console.log(`first row: ${plugin.getFirstVisibleRow()}`)
      // console.log(`second row: ${plugin.getLastVisibleRow()}`)
      ipc.send('hasHeaderRow', hot.hasColHeaders())
      ipc.send('hasCaseSensitiveHeader', isCaseSensitive(hotId))
    })
    onNextHotIdFromTabRx(getHotIdFromTabIdFunction())
  },
  created: function() {
    const vueGuessProperties = this.inferColumnProperties
    ipc.on('guessColumnProperties', function(event, arg) {
      vueGuessProperties()
    })
    const vueImportDataPackage = this.importDataPackage
    ipc.on('importDataPackage', function(event, filePath, isTransient = false) {
      vueImportDataPackage(filePath, isTransient)
    })
    const vueValidateTable = this.validateTable
    ipc.on('validateTable', function(event, arg) {
      vueValidateTable()
    })
    this.pushDefaultPackageProperties()
    ipc.send('closedFindReplace')
  },
  updated: function() {
    if (this.loadingDataMessage && this.loadingDataMessage.length > 0) {
      document.querySelector('.modal1').classList.remove('modalHide')
    }
  }
}
</script>
<style scoped>
@import '~components-font-awesome/css/fontawesome-all.min.css'
</style>
<style lang="styl" scoped>
@import '~static/css/default'
</style>
<style scoped>
@import '~handsontable/dist/handsontable.full.css'
</style>
<style scoped>
@import '~static/css/panels'
</style>
<style lang="styl" scoped>
@import '~static/css/panel'
</style>
</style>
<style lang="styl" scoped>
@import '~static/css/tooltip'
</style>
<style lang="styl" scoped>
@import '~static/css/validationrules'
</style>
<style lang="styl" scoped>
@import '~static/css/icons'
</style>
