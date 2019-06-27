<template>
  <div
    id="home-container"
    class="panel panel-group">
    <div
      id="header-panel"
      class="panel-heading">
      <nav class="navbar navbar-default">
        <div class="container-fluid">
          <div class="navbar-header">
            <a class="navbar-brand" />
          </div>
          <div id="toolbar">
            <ul class="nav navbar-nav">
              <li
                v-for="(menu, index) in toolbarMenus"
                :key="index"
                :class="{ 'active': toolbarIndex === index}"
                @click="updateToolbarMenu(index)">
                <a
                  v-tooltip="tooltip(menu.tooltipId)"
                  href="#">
                  <!-- <a href="#"> -->
                  <i
                    v-if="menu.icon"
                    :class="menu.icon"
                    class="fa"
                    aria-hidden="true" />
                  <object
                    v-if="menu.image"
                    :class="menu.class"
                    :data="menu.image"
                    type="image/svg+xml" />
                  <div
                    :id="menu.id"
                    class="toolbar-text">{{ menu.name }}</div>
                </a>
                <component :is="menu.tooltipView" />
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </div>
    <div
      id="body-panel"
      class="panel">
      <nav
        id="sidenav"
        :class="sideNavProperties"
        class="sidenav navbar navbar-default row">
        <!-- <div> -->
        <div class="navbar-header">
          <ul class="nav navbar-right closebtn">
            <li>
              <a href="#">
                <span
                  v-show="sideNavStatus === 'open'"
                  class="btn-default fa fa-times"
                  @click="closeSideNav" />
              </a>
            </li>
          </ul>
          <a
            class="navbar-brand"
            href="#">
            {{ sideNavViewTitle }}
          </a>
        </div>
        <transition
          :name="sideNavTransition"
          :css="enableTransition"
          mode="out-in">
          <component
            ref="sidenavref"
            :is="sideNavView"
            :adjustSidenavFormHeight="adjustSidenavFormHeight"
            :sideNavFormHeight="sideNavFormHeight"
            :cIndex="currentColumnIndex"
            :isLocked="isActiveTabLocked"
          />
        </transition>
        <div
          v-show="sideNavPosition === 'right'"
          id="sidenav-footer"
          class="panel-footer row">
          <a
            v-tooltip.left="tooltip('tooltip-previous')"
            v-if="isLeftArrowEnabled"
            href="#"
            class="left"
            @click.prevent="sideNavLeft()"><span class="btn fa fa-chevron-left fa-2x" /></a>
          <component
            v-if="isLeftArrowEnabled"
            :is="'tooltipPrevious'" />
          <a
            v-tooltip.left="tooltip('tooltip-next')"
            v-if="isRightArrowEnabled"
            href="#"
            class="right"
            @click.prevent="sideNavRight()"><span class="btn fa fa-chevron-right fa-2x" /></a>
          <component
            v-if="isRightArrowEnabled"
            :is="'tooltipNext'" />
        </div>
      </nav>
      <div
        id="main-panel"
        :class="sideNavPropertiesForMain"
        class="panel panel-default">
        <div
          id="main-middle-panel"
          :class="messageStatus"
          class="panel panel-body">
          <div id="csvEditor">
            <ul class="nav nav-tabs">
              <li>
                <ul
                  id="csvTab"
                  class="nav nav-tabs">
                  <li
                    v-for="tab in tabs"
                    :id="tab"
                    :key="tab"
                    :class="{active: activeTab == tab}"
                    class="tab-header"
                    @click="setActiveTabWrapper(tab)">
                    <a>
                      <span>{{ tabTitle(tab) }}</span>
                      <span
                        v-if="tabs.length > 1"
                        class="tabclose btn-default fa fa-times"
                        @click.stop="closeTab"/>
                    </a>
                  </li>
                </ul>
              </li>
              <li
                v-tooltip.right="tooltip('tooltip-add-tab')"
                class="add-tab"
                @click="addTab()">
                <a>&nbsp;<button
                  type="button"
                  class="btn btn-sm"><i class="fa fa-plus"/></button></a>
              </li>
              <component :is="'tooltipAddTab'" />
            </ul>
            <div
              id="csvContent"
              class="tab-content">
              <div
                v-for="tab in tabs"
                :key="tab"
                :class="{ active: activeTab == tab}"
                class="tab-pane">
                <div class="editor" />
              </div>
            </div>
          </div>
        </div>
        <div
          id="main-bottom-panel"
          :class="mainBottomPanelStatus"
          class="panel-footer">
          <div
            id="message-panel"
            class="panel-default">
            <!-- tidy up messages view with components -->
            <div
              v-show="toggleMessageView()"
              class="message-view">
              <div class="message-title-container affix">
                <ul class="nav navbar-right closebtn">
                  <li>
                    <a
                      href="#"
                      @click="closeMessages()">
                      <span class="btn-default fa fa-times"/>
                    </a>
                  </li>
                </ul>
                <h3 class="message-title">{{ messagesTitle }}</h3>
              </div>
              <template v-if="messagesType === 'error'">
                <nav class="navbar errors-meta affix">
                  <div class="container-fluid">
                    <i class="navbar-text">{{ messages.length }} Error(s)</i>
                    <ul class="nav navbar-nav navbar-left" >
                      <li>
                        <a
                          v-tooltip.top="tooltip('tooltip-open-errors-window')"
                          href="#"
                          @click="openErrorsWindow()">
                          <span class="btn-default fas fa-external-link-alt"/>
                        </a>
                      </li>
                      <component :is="'tooltipOpenErrorsWindow'" />
                      <li>
                        <a
                          v-tooltip.top="tooltip('tooltip-write-errors-provenance')"
                          href="#"
                          @click.prevent="writeErrorsToProvenance()">
                          <object
                            data="static/img/validation-results.svg"
                            type="image/svg+xml" />
                        </a>
                      </li>
                      <component :is="'tooltipWriteErrorsProvenance'" />
                    </ul>
                  </div>
                </nav>
                <div class="errors-content">
                  <div
                    v-for="(errorMessage, index) in messages"
                    :id="'error-messages' + index"
                    :key="index">
                    <a
                      href="#"
                      @click.prevent="goToCell(errorMessage.rowNumber, errorMessage.columnNumber)"
                      @mouseover="hoverToSelectErrorCell(errorMessage.rowNumber, errorMessage.columnNumber)"
                      @mouseout="exitHoverToSelectErrorCell(errorMessage.rowNumber, errorMessage.columnNumber)">
                      <span v-show="errorMessage.rowNumber">(row:{{ errorMessage.rowNumber }})</span>
                      <span v-show="errorMessage.columnNumber">(column:{{ errorMessage.columnNumber }})</span>
                      <span>{{ errorMessage.message }}</span>
                    </a>
                  </div>
                </div>
              </template>
              <div
                v-else
                id="other-message">
                <span>{{ messages }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div
      id="footer-panel"
      class="panel panel-footer">
      <div
        v-show="loadingDataMessage"
        class="loading-pane" />
      <div
        v-show="loadingDataMessage"
        class="modalHide modal1">
        <span class="glyphicon glyphicon-refresh spinning" />
        <span class="validation-load">
          {{ loadingDataMessage }}
        </span>
      </div>
    </div>
  </div>
</template>
<script>
import {
  mapMutations,
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
  getCurrentColumnIndexOrMin
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
import {
  createDataPackage
} from '@/frictionlessDataPackage.js'
import HomeTooltip from '../mixins/HomeTooltip'
import ErrorsTooltip from '../mixins/ErrorsTooltip'
import {
  fileFormats
} from '../file-formats.js'
import {
  ipcRenderer as ipc,
  remote
} from 'electron'
import 'lodash/lodash.min.js'
import {
  unzipFile
} from '@/importPackage.js'
import {
  toggleHeaderWithFeedback
} from '@/headerRow.js'
import {
  onNextHotIdFromTabRx,
  hotIdFromTab$,
  provenanceErrors$,
  errorFeedback$,
  updateHotDimensions$,
  allTableLocks$
} from '@/rxSubject.js'
import VueRx from 'vue-rx'
import {
  Subscription
} from 'rxjs/Subscription'
import {
  getHotIdFromTabIdFunction
} from '@/store/modules/hots.js'
import {
  isCaseSensitive
} from '@/frictionlessUtilities'
import Handsontable from 'handsontable/dist/handsontable.full.min.js'
import AsyncComputed from 'vue-async-computed'
import Vue from 'vue'
import {
  toolbarMenus
} from '@/toolbarMenus'
import { LockProperties } from '@/lockProperties'
Vue.use(AsyncComputed)
Vue.use(VueRx, {
  Subscription
})
export default {
  name: 'Home',
  components: {
    about,
    preferences,
    column,
    tabular,
    packager,
    provenance,
    findReplace
  },
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
      timeoutTimerId: null,
      toolbarMenus: toolbarMenus,
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
      reportSiblingClasses: ['main-bottom-panel', 'main-middle-panel'],
      isActiveTabLocked: false
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
      updateHotDimensions$.next()
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
  watch: {
    activeTab: async function(tabId) {
      try {
        let hotId = await this.getHotIdFromTabId(tabId)
        this.currentHotId = hotId
        this.reselectHotCell()
      } catch (err) {
        console.error('Problem with getting hot id from watched tab', err)
      }
      this.closeMessages()
      this.sendErrorsToErrorsWindow()
      LockProperties.trigger()
    },
    messages: function() {
      if (this.messages) {
        this.sendErrorsToErrorsWindow()
      }
    }
  },
  mounted: function() {
    let self = this

    this.$subscribeTo(allTableLocks$, async function(allTablesLocks) {
      self.isActiveTabLocked = _.includes(allTablesLocks, self.currentHotId)
      ipc.send('hasLockedColumns', self.isActiveTabLocked)
    })
    // request may be coming from another page - get focus first
    ipc.on('showErrorCell', async function(event, arg) {
      await ipc.send('focusMainWindow')
      // ensure cell select occurs after main window focus
      _.delay(function(arg) {
        self.goToCell(arg.row, arg.column)
      }, 100, arg)
    })
    ipc.on('getErrorMessages', function(event, arg) {
      self.sendErrorsToErrorsWindow(arg)
    })
    ipc.on('hoverToSelectErrorCell', function(event, arg) {
      self.hoverToSelectErrorCell(arg.rowNumber, arg.columnNumber)
    })
    ipc.on('exitHoverToSelectErrorCell', function(event, arg) {
      self.exitHoverToSelectErrorCell(arg.rowNumber, arg.columnNumber)
    })
    ipc.on('triggerMenuButton', function(event, arg) {
      self.triggerMenuButton(arg)
    })
    ipc.on('toggleActiveHeaderRow', function() {
      self.toggleHeader()
    })
    ipc.on('addTab', function() {
      self.addTab()
    })
    ipc.on('addTabWithData', function(e, data) {
      self.addTab(data)
    })
    ipc.on('addTabWithFormattedData', function(e, data, format) {
      self.addTab(data, format)
    })
    ipc.on('addTabWithFormattedDataAndDescriptor', function(e, data, format, descriptor) {
      self.addTab(data, format, descriptor)
    })
    ipc.on('addTabWithFormattedDataFile', function(e, data, format, filename) {
      self.addTabWithFilename(data, format, filename)
    })
    ipc.on('showSidePanel', function(event, arg1, arg2) {
      self.triggerSideNav({
        sideNavView: arg1,
        title: arg2 || arg1
      })
    })
    ipc.on('saveDataSuccess', function(e, format, fileName) {
      self.$forceUpdate()
    })
    ipc.on('resized', function() {
      updateHotDimensions$.next()
    })
    this.$nextTick(function() {
      require('../index.js')
      const csvTab = document.getElementById('csvTab')
      Sortable.create(csvTab, {
        animation: 150,
        onSort: function(evt) {
          let tabIdOrder = []
          document.querySelectorAll('#csvTab .tab-header').forEach((el) => {
            tabIdOrder.push(el.id)
          })
          self.setTabsOrder(tabIdOrder)
        }
      })
      this.closeSideNav()
      this.addTab()
    })
    ipc.on('showProvenanceErrors', function(event, arg) {
      self.showProvenanceErrors()
    })
    ipc.on('closeAndshowLoadingScreen', function(event, message) {
      self.closeAndShowLoadingScreen(message)
    })
    ipc.on('closeLoadingScreen', function(event) {
      self.closeLoadingScreen()
    })
    ipc.on('resetPackagePropertiesToObject', function(event, packageProperties) {
      self.resetPackagePropertiesToObject(packageProperties)
    })
    this.$subscribeTo(errorFeedback$, function(nextError) {
      if (!self.messages) {
        self.messages = []
      }
      self.messages.push(nextError)
    })
    this.$subscribeTo(updateHotDimensions$, function(message) {
      self.updateDimensions()
    })
  },
  beforeCreate: function() {
    let self = this
    this.$subscribeTo(hotIdFromTab$, function(hotId) {
      let hot = HotRegister.getInstance(hotId)
      if (hot) {
        ipc.send('hasHeaderRow', hot.hasColHeaders())
      }
      ipc.send('hasCaseSensitiveHeader', isCaseSensitive(hotId))
      remote.getGlobal('tab').activeHotId = hotId
    })
    onNextHotIdFromTabRx(getHotIdFromTabIdFunction())
  },
  created: function() {
    let self = this
    ipc.on('guessColumnProperties', function(event, arg) {
      self.inferColumnProperties()
    })
    ipc.on('importDataPackage', function(event, filePath, isTransient = false) {
      self.importDataPackage(filePath, isTransient)
    })
    ipc.on('validateTable', function(event, arg) {
      self.validateTable()
    })
    this.pushDefaultPackageProperties()
    ipc.send('closedFindReplace')
  },
  updated: function() {
    if (this.loadingDataMessage && this.loadingDataMessage.length > 0) {
      document.querySelector('.modal1').classList.remove('modalHide')
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
      'pushProvenanceErrors',
      'removeProvenanceErrors'
    ]),
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
      let selected = hot.getSelectedLast()
      // with deselectOutsideHot set to true, we need to track last selection.
      this.pushHotSelection({
        hotId: hot.guid,
        selected: selected
      })
      this.updateActiveColumn(selected)
    },
    inferColumnProperties: async function() {
      try {
        this.messages = await guessColumnProperties()
        this.messagesType = 'feedback'
        this.messagesTitle = 'Guess column properties'
      } catch (err) {
        console.error(err)
      }
    },
    reportValidationSuccess: function() {
      if (this.messages.length > 0) {
        this.messagesTitle = 'Validation Errors'
        this.messagesType = 'error'
        const hot = HotRegister.getInstance(this.currentHotId)
        this.setHotComments(hot)
        hot.updateSettings({
          cell: this.previousComments
        })
      } else {
        this.messagesTitle = 'Validation Success'
        this.messages = 'No validation errors reported.'
        this.messagesType = 'feedback'
      }
      this.closeLoadingScreen()
    },
    errorHtmlRenderer: function(instance, td, row, col, prop, value, cellProperties) {
      // must use default renderer before adding changes
      Handsontable.renderers.TextRenderer.apply(this, arguments)
      td.style.backgroundColor = this.errorColor
      return td
    },
    validateTable: function() {
      this.loadingDataMessage = 'Validating Table...'
      let self = this
      _.delay(function() {
        self.validateTableCore()
      }, 100)
    },
    validateTableCore: async function() {
      try {
        this.closeMessages()
        this.messages = []
        let hot = HotRegister.getInstance(this.currentHotId)
        this.removePreviousHotComments(hot)
        await validateActiveDataAgainstSchema(this.reportValidationSuccess)
      } catch (err) {
        console.error('There was an error(s) validating table.', err)
      } finally {
        this.closeLoadingScreen()
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
      this.updateHotComments()
    },
    createPackage: async function() {
      try {
        let messages = await createDataPackage()
        if (messages.length > 0) {
          this.exportPackageErrors(messages.map(x => {
            return {
              message: x
            }
          }))
        } else {
          this.exportPackageFeedback()
        }
      } catch (err) {
        console.error('There was an error creating a data package.', err)
      }
    },
    latestHotContainer: function() {
      let allEditors = document.querySelectorAll('#csvContent .editor')
      return allEditors[allEditors.length - 1]
    },
    addTabWithFilename: function(data, format, filename, descriptor = {}) {
      this.createHotDataContainer(data, format, descriptor)
      this.$nextTick(function() {
        this.pushTabObject({
          id: this.activeTab,
          filename: filename
        })
      })
    },
    addTab: function(data = ',,', format, descriptor) {
      this.createHotDataContainer(data, format, descriptor)
    },
    setActiveTabWrapper: function(tabId) {
      let hot = HotRegister.getActiveInstance()
      if (hot) {
        hot.deselectCell()
      }
      this.setActiveTab(tabId)
    },
    closeAndShowLoadingScreen: function(message, errorMessage) {
      this.closeLoadingScreen()
      this.showLoadingScreen(message, errorMessage)
    },
    showLoadingScreen: function(message, errorMessage, timeout) {
      this.loadingDataMessage = message
      // set timeout for loading screen
      this.initLoadingScreenTimeout(errorMessage, timeout)
    },
    initLoadingScreenTimeout: function(errorMessage, timeout = 30000) {
      this.clearLoadingTimeout()
      let self = this
      this.timeoutTimerId = _.delay(function() {
        if (self.isLoadingMessageRunning()) {
          self.closeLoadingScreen()
          ipc.send('loadingScreenTimeout', errorMessage)
        }
      }, timeout)
    },
    closeLoadingScreen: function() {
      this.loadingDataMessage = false
      this.clearLoadingTimeout()
    },
    clearLoadingTimeout: function() {
      if (this.timeoutTimerId) {
        clearTimeout(this.timeoutTimerId)
        this.timeoutTimerId = null
      }
    },
    isLoadingMessageRunning: function() {
      return this.loadingDataMessage
    },
    createHotDataContainer: function(data, format = {}, descriptor = {}) {
      this.initTab()
      let vueLatestHotContainer = this.latestHotContainer
      this.$nextTick(function() {
        this.registerContainer(vueLatestHotContainer())
        const updatedFormat = this.mergeOntoCsvFormat(format)
        const hotId = this.loadDataIntoLatestHot(data, updatedFormat)
        this.initHotTablePropertiesFromDescriptor(hotId, descriptor)
        this.initHotColumnPropertiesFromSchema(hotId, descriptor.schema)
        // hot rendering problem when tabs opened quickly - https://github.com/ODIQueensland/data-curator/issues/803- workaround as selecting table re-renders
        getCurrentColumnIndexOrMin()
        updateHotDimensions$.next()
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
      }, findReplace.data().hotParameters)
      addHotContainerListeners(container, this.closeAndShowLoadingScreen, this.closeLoadingScreen)
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
      let self = this
      // hack! - force data to wait for latest render e.g, for loader message
      window.setTimeout(function() {
        // getting current col may also trigger error if bad excel sheet, so provide user feedback
        try {
          loadData(activeHotId, data, format, self.closeLoadingScreen)
          getCurrentColumnIndexOrMin()
        } catch (error) {
          console.error('ERROR: load data problem: ', error)
          ipc.send('dataParsingError')
        }
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
        this.pushPackageProperty({
          key: x.key,
          value: x.value
        })
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
      this.removeProvenanceErrors(hotId)
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
      updateHotDimensions$.next()
    },
    openSideNav: function() {
      this.sideNavStatus = 'open'
      // ensure sidenav menu is rendered before adjusting form height
      updateHotDimensions$.next()
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
        console.error('Cannot update active column without a column selected.')
      }
    },
    updateToolbarMenuForButton: function(index) {
      this.toolbarIndex = index
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
          console.error(`Error: No case exists for menu index: ${index}`)
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
    updateHotComments: function() {
      let hot = HotRegister.getActiveInstance()
      this.removePreviousHotComments(hot)
      if (this.messagesType === 'error') {
        this.setHotComments(hot)
      }
    },
    removePreviousHotComments: function(hot) {
      for (const previousComment of this.previousComments) {
        _.unset(previousComment, 'comment')
        _.unset(previousComment, 'renderer')
      }
      hot.updateSettings({
        cell: this.previousComments
      })
      this.previousComments = []
    },
    setHotComments: function(hot) {
      for (const errorMessage of this.messages) {
        this.setHotComment(hot, errorMessage)
      }
    },
    setHotComment: function(hot, errorMessage) {
      let range = this.getCellOrRowFromCount(hot, errorMessage.rowNumber, errorMessage.columnNumber)
      this.previousComments.push({
        row: range.from.row,
        col: range.from.col,
        comment: {
          value: errorMessage.message
        },
        renderer: this.errorHtmlRenderer
      })
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
      return {
        from: {
          col: columnFromIndex,
          row: rowIndex
        },
        to: {
          col: columnToIndex,
          row: rowIndex
        }
      }
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
      return {
        from: {
          col: columnFromIndex,
          row: rowIndex
        },
        to: {
          col: columnToIndex,
          row: rowIndex
        }
      }
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
      return {
        title: this.messagesTitle,
        messages: this.messages
      }
    },
    closeMessages: function() {
      this.messages = false
      this.messagesType = ''
      this.messageTitle = ''
    },
    toggleMessageView: function() {
      const errorWindow = getWindow('errors')
      if (this.messagesType === 'error' && errorWindow) {
        return false
      }
      return this.messages
    },
    openErrorsWindow: async function() {
      await ipc.send('showErrorsWindow')
    },
    sendErrorsToErrorsWindow: function(id) {
      const browserWindow = getWindow('errors', id)
      if (browserWindow) {
        if (this.messages && this.messagesType === 'error') {
          // opening error window will trigger close messages, so ensure have these first
          const errorMessages = this.packErrorMessages()
          // if window dom is already present, send error messages
          browserWindow.webContents.send('errorMessages', errorMessages)
          // but the window will not receive anything if not yet dom-ready
          browserWindow.webContents.on('dom-ready', function() {
            browserWindow.webContents.send('errorMessages', errorMessages)
          })
        } else {
          // this alerts error window to close - so only needed for dom-ready error window
          browserWindow.webContents.send('errorMessages')
        }
        // messages are to appear in 1 window or the other, not both (get messsages first if required)
        this.closeMessages()
      } else {
        // console.log('no error window found. ignoring...')
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
      this.pushProvenanceErrors({
        hotId: this.currentHotId,
        errors: this.messages
      })
      this.showProvenanceErrors()
    },
    showProvenanceErrors: function() {
      this.updateToolbarMenu(3)
      provenanceErrors$.next()
    },
    updateDimensions: function() {
      const self = this
      // provide enough time for panel to open or close before resizing
      _.delay(function() {
        self.adjustSidenavFormHeight()
        let hot = HotRegister.getActiveInstance()
        hot.render()
      }, 500)
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
<style lang="styl" scoped>
@import '~static/css/tooltip'
</style>
<style lang="styl" scoped>
@import '~static/css/validationrules'
</style>
<style lang="styl" scoped>
@import '~static/css/icons'
</style>
