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
                <div class="toolbar-text">{{menu.name}}</div>
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
          <component :is="sideNavView" :adjustSidenavFormHeight="adjustSidenavFormHeight" :sideNavFormHeight="sideNavFormHeight" :cIndex="currentColumnIndex">
          </component>
        </transition>
        <div v-show="sideNavPosition === 'right'" id="sidenav-footer" class="panel-footer row">
          <a v-if="enableSideNavLeftArrow" href="#" v-tooltip="tooltip('tooltip-previous')" class="left" @click.prevent="sideNavLeft"><span class="btn fa fa-chevron-left fa-2x" /></a>
          <component v-if="enableSideNavLeftArrow" is="tooltipPrevious" />
          <a v-if="enableSideNavRightArrow" href="#" v-tooltip="tooltip('tooltip-next')" class="right" @click.prevent="sideNavRight"><span class="btn fa fa-chevron-right fa-2x" /></a>
          <component v-if="enableSideNavRightArrow" is="tooltipNext" />
        </div>
    </nav>
    <div id="main-panel" class="panel panel-default" :class="sideNavPropertiesForMain">
      <div id="main-middle-panel" class="panel panel-body" :class="messageStatus">
        <div id='csvEditor'>
          <ul class="nav nav-tabs">
            <li>
              <ul class="nav nav-tabs" id='csvTab'>
                <li v-for="tab in tabs" :id="tab" :key="tab" :class="{active: activeTab == tab}" class="tab-header" @click="setActiveTab(tab)">
                  <a>
                    <span>{{tabTitle(tab)}}</span>
                    <span v-if="tabs.length > 1" class="tabclose btn-default fa fa-times" @click.stop="closeTab"></span>
                  </a>
                </li>
              </ul>
            </li>
            <li class="tab-add" @click="addTab" v-tooltip="tooltip('tooltip-add-tab')">
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
          <div v-show="messages">
            <ul class="nav navbar-right closebtn">
              <li>
                <a href="#" @click="closeMessages()">
                  <span style="color:#000" class="btn-default fa fa-times" />
                </a>
              </li>
            </ul>
              <h3>{{messagesTitle}}</h3>
              <template  v-if="messagesType === 'error'">
                <div v-for="errorMessage in messages">
                  <span v-show="errorMessage.rowNumber">(row:{{errorMessage.rowNumber}})</span>
                  <span v-show="errorMessage.columnNumber">(column:{{errorMessage.columnNumber}})</span>
                  <span>{{errorMessage.message}}</span>
                </div>
              </template>
              <div v-else>
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
  loadData
} from '../index.js'
import {
  HotRegister,
  getColumnCount,
  getCurrentColumnIndexOrMin,
  getCurrentColumnIndexOrMax,
  reselectCurrentCellOrMin,
  incrementActiveColumn,
  decrementActiveColumn,
  getActiveSelected,
  reselectCellOrMin
} from '../hot.js'
import about from '../partials/About'
import preferences from '../partials/Preferences'
import column from '../partials/ColumnProperties'
import tabular from '../partials/TableProperties'
import packager from '../partials/PackageProperties'
import provenance from '../partials/ProvenanceProperties'
import {
  guessColumnProperties,
  validateActiveDataAgainstSchema
} from '../frictionless.js'
import {createDataPackage} from '@/frictionlessDataPackage.js'
import HomeTooltip from '../mixins/HomeTooltip'
import {
  fileFormats
} from '../file-formats.js'
import {ipcRenderer as ipc} from 'electron'
import 'bootstrap/dist/js/bootstrap.min.js'
import 'lodash/lodash.min.js'
import '../menu.js'
import {unzipFile} from '@/importPackage.js'
import {toggleHeaderWithFeedback} from '@/headerRow.js'
import {onNextHotIdFromTabRx, hotIdFromTab$} from '@/rxSubject.js'
import {getHotIdFromTabIdFunction} from '@/store/modules/hots.js'
export default {
  name: 'home',
  mixins: [HomeTooltip],
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
      enableSideNavLeftArrow: true,
      enableSideNavRightArrow: true,
      messagesType: '',
      messages: false,
      messagesTitle: 'Feedback',
      loadingDataMessage: false,
      sideNavFormHeight: '300px',
      toolbarMenus: [{
        name: 'Guess',
        image: 'static/img/guess-column-properties.svg',
        tooltipId: 'tooltip-guess',
        tooltipView: 'tooltipGuess'
      },
      {
        name: 'Column',
        image: 'static/img/column-properties.svg',
        tooltipId: 'tooltip-column',
        tooltipView: 'tooltipColumn',
        sideNavPosition: 'right',
        sideNavView: 'column'
      },
      {
        name: 'Table',
        image: 'static/img/table-properties.svg',
        tooltipId: 'tooltip-table',
        tooltipView: 'tooltipTable',
        sideNavPosition: 'right',
        sideNavView: 'tabular'
      },
      {
        name: 'Provenance',
        image: 'static/img/provenance-information.svg',
        tooltipId: 'tooltip-provenance',
        tooltipView: 'tooltipProvenance',
        sideNavPosition: 'right',
        sideNavView: 'provenance'
      },
      {
        name: 'Package',
        image: 'static/img/data-package-properties.svg',
        tooltipId: 'tooltip-package',
        tooltipView: 'tooltipPackage',
        sideNavPosition: 'right',
        sideNavView: 'packager'
      },
      {
        name: 'Validate',
        image: 'static/img/validate.svg',
        tooltipId: 'tooltip-validate',
        tooltipView: 'tooltipValidate'
      },
      {
        name: 'Export',
        image: 'static/img/export.svg',
        tooltipId: 'tooltip-export',
        tooltipView: 'tooltipExport',
        sideNavView: 'export'
      }
      ],
      defaultTableProperties: [{
        key: 'profile',
        value: 'tabular-data-resource'
      },
      {
        key: 'format',
        value: 'csv'
      },
      {
        key: 'mediatype',
        value: 'text/csv'
      },
      {
        key: 'encoding',
        value: 'utf-8'
      }],
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
    ...mapGetters(['getPreviousTabId', 'tabTitle', 'getHotIdFromTabId']),
    sideNavPropertiesForMain() {
      return this.sideNavStatus === 'closed' ? this.sideNavStatus : this.sideNavPosition
    },
    sideNavProperties() {
      return `${this.sideNavStatus} ${this.sideNavPosition}`
    },
    toolbarMenuName() {
      return _.get(this.toolbarMenus[this.toolbarIndex], 'name')
    },
    maxColAllowed() {
      return getColumnCount() - 1
    },
    messageStatus() {
      return this.messages ? 'messages-opened' : 'messages-closed'
    },
    mainBottomPanelStatus() {
      return `${this.messageStatus} ${this.sideNavPropertiesForMain}`
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
      'pushAllColumnsProperty',
      'pushTableProperty',
      'pushPackageProperty'
    ]),
    selectionListener: function() {
      this.updateActiveColumn()
      this.resetSideNavArrows()
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
    // TODO: tidy up error view handling and consistency in dependent usages
    closeMessages: function() {
      this.messages = false
      this.messagesType = ''
      this.messageTitle = ''
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
    importDataPackage: async function(filename) {
      let message = await unzipFile(filename, this.storeResetCallback)
      this.messagesTitle = message ? 'Import Data Package Error' : 'Import Data Package Success'
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
    addTabWithFormattedDataFile: function(data, format, filename) {
      this.initTab()
      let vueLatestHotContainer = this.latestHotContainer
      this.$nextTick(function() {
        this.loadFormattedDataIntoContainer(vueLatestHotContainer(), data, format)
        this.pushTabObject({id: this.activeTab, filename: filename})
      })
    },
    addTabWithData: function(data) {
      this.initTab()
      let vueLatestHotContainer = this.latestHotContainer
      this.$nextTick(function() {
        this.loadDataIntoContainer(vueLatestHotContainer(), data)
      })
    },
    addTab: function() {
      this.initTab()
      let vueLatestHotContainer = this.latestHotContainer
      this.$nextTick(function() {
        // update latest tab object with content
        this.loadDefaultDataIntoContainer(vueLatestHotContainer())
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
      this.setActiveTab(nextTabId)
      this.pushTab(nextTabId)
    },
    loadDefaultDataIntoContainer: function(container) {
      let defaultData = '"","",""'
      this.loadDataIntoContainer(container, defaultData)
    },
    loadDataIntoContainer: function(container, data) {
      let defaultFormat = fileFormats.csv
      this.loadFormattedDataIntoContainer(container, data, defaultFormat)
    },
    showLoadingScreen: function(message) {
      this.loadingDataMessage = message
    },
    closeLoadingScreen: function() {
      this.loadingDataMessage = false
    },
    loadFormattedDataIntoContainer: function(container, data, format) {
      HotRegister.register(container, {
        selectionListener: this.selectionListener,
        loadingStartListener: this.showLoadingScreen,
        loadingFinishListener: this.closeLoadingScreen
      })
      addHotContainerListeners(container)
      let hot = HotRegister.getActiveInstance()
      let activeHotId = hot.guid
      let activeTabId = this.activeTab
      // hack! - force data to wait for latest render e.g, for loader message
      window.setTimeout(function() {
        loadData(activeHotId, data, format)
      }, 1)
      this.pushHotTab({
        'hotId': activeHotId,
        'tabId': activeTabId
      })
      this.pushDefaultTableProperties(hot.guid)
    },
    pushDefaultTableProperties: function(hotId) {
      this.defaultTableProperties.forEach(x => {
        this.pushTableProperty({hotId: hotId, key: x.key, value: x.value})
      })
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
        this.setActiveTab(previousTabId)
      }
      this.destroyTabObject(tabId)
      let hotId = await this.getHotIdFromTabId(tabId)
      this.destroyHotTab(hotId)
      HotRegister.destroyHot(hotId)
    },
    closeSideNav: function() {
      this.enableTransition = false
      this.sideNavStatus = 'closed'
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
    resetSideNavArrows: function() {
      this.enableSideNavLeftArrow = false
      this.enableSideNavRightArrow = false
      if (this.sideNavView === 'column') {
        // this.currentColumnIndex = getCurrentColumnIndexOrMin()
        this.enableSideNavLeftArrow = this.currentColumnIndex > 0
        this.enableSideNavRightArrow = this.currentColumnIndex < this.maxColAllowed
      }
    },
    updateSideNavState: function() {
      let toolbarMenu = this.toolbarMenus[this.toolbarIndex]
      this.sideNavPosition = toolbarMenu.sideNavPosition
      this.sideNavView = toolbarMenu.sideNavView
      this.sideNavViewTitle = toolbarMenu.name
      this.openSideNav()
      // ensure a cell is selected before any of menu tools start
      reselectCurrentCellOrMin()
      this.resetSideNavArrows()
    },
    updateToolbarMenuForSideNav: function(index) {
      if (this.sideNavStatus === 'closed' || this.toolbarIndex === -1) {
        this.enableTransition = false
      } else {
        this.updateTransitions(index)
        this.enableTransition = true
      }
      this.toolbarIndex = index
      this.updateSideNavState()
    },
    updateActiveColumn: function() {
      let selected = getActiveSelected()
      if (selected) {
        this.currentColumnIndex = selected[1]
      } else {
        // ('Cannot update active column without a column selected.')
      }
    },
    updateToolbarMenuForColumn: function(index) {
      let maxColAllowed = this.maxColAllowed
      let currentColIndex = getCurrentColumnIndexOrMax()
      if (index < this.toolbarIndex && currentColIndex > 0) {
        decrementActiveColumn(currentColIndex)
        this.updateActiveColumn()
      } else if (index > this.toolbarIndex) {
        if (currentColIndex < maxColAllowed) {
          incrementActiveColumn(currentColIndex)
          this.updateActiveColumn()
        } else {
          this.updateToolbarMenu(index)
        }
      }
      this.resetSideNavArrows()
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
    },
    updateToolbarMenuFromArrows: function(index) {
      if (this.sideNavView === 'column') {
        this.updateToolbarMenuForColumn(index)
      } else if (index > 0) {
        this.updateToolbarMenu(index)
      }
    },
    sideNavLeft: function() {
      let nextIndex = this.toolbarIndex - 1
      let nextToolbar = this.toolbarMenus[nextIndex]
      if (nextToolbar.sideNavView === 'column') {
        getCurrentColumnIndexOrMax()
      }
      this.updateToolbarMenuFromArrows(nextIndex)
    },
    sideNavRight: function() {
      let nextIndex = this.toolbarIndex + 1
      if (nextIndex < this.toolbarMenus.length) {
        this.updateToolbarMenuFromArrows(nextIndex)
      }
    },
    createTabId: function(tabId) {
      return `tab${tabId}`
    },
    triggerSideNav: function(properties) {
      this.toolbarIndex = -1
      this.sideNavPosition = properties.sideNavPosition || 'left'
      this.sideNavTransition = properties.sideNavTransition || 'left'
      this.sideNavView = properties.sideNavView
      this.sideNavViewTitle = properties.name || properties.sideNavView
      this.enableTransition = properties.enableTransition || false
      this.openSideNav()
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
      // (`height is ${sidenavHeight}`)
      let form = sidenav.querySelector('form')
      this.sideNavFormHeight = (sidenavHeight - 150) + 'px'
      if (form) {
        form.style.height = this.sideNavFormHeight
      }
    },
    toggleHeader: function() {
      let hot = HotRegister.getActiveInstance()
      toggleHeaderWithFeedback(hot, this.toggleHeaderErrorMessage, this.closeMessages)
    },
    toggleHeaderErrorMessage: function() {
      this.messagesTitle = 'Header Error'
      this.messages = 'At least 2 rows are required before a header row can be set.'
      this.messagesType = 'feedback'
    }
  },
  components: {
    about,
    preferences,
    column,
    tabular,
    packager,
    provenance
  },
  watch: {
    activeTab: async function(tabId) {
      try {
        let hotId = await this.getHotIdFromTabId(tabId)
        this.currentHotId = hotId
        reselectCellOrMin(hotId)
      } catch (err) {
        console.log('Problem with getting hot id from watched tab', err)
      }
    }
  },
  mounted: function() {
    const vueTriggerMenuButton = this.triggerMenuButton
    ipc.on('triggerMenuButton', function(event, arg) {
      vueTriggerMenuButton(arg)
    })
    const vueToggleHeader = this.toggleHeader
    ipc.on('toggleActiveHeaderRow', function() {
      vueToggleHeader()
    })
    const vueAddTabWithData = this.addTabWithData
    ipc.on('addTabWithData', function(e, data) {
      vueAddTabWithData(data)
    })
    const vueAddTabWithFormattedDataFile = this.addTabWithFormattedDataFile
    ipc.on('addTabWithFormattedDataFile', function(e, data, format, filename) {
      vueAddTabWithFormattedDataFile(data, format, filename)
    })
    const vueAddTab = this.addTab
    ipc.on('addTab', function() {
      vueAddTab()
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
  },
  beforeCreate: function() {
    this.$subscribeTo(hotIdFromTab$, function(hotId) {
      let hot = HotRegister.getInstance(hotId)
      ipc.send('hasHeaderRow', hot.hasColHeaders())
    })
    onNextHotIdFromTabRx(getHotIdFromTabIdFunction())
  },
  created: function() {
    const vueGuessProperties = this.inferColumnProperties
    ipc.on('guessColumnProperties', function(event, arg) {
      vueGuessProperties()
    })
    const vueImportDataPackage = this.importDataPackage
    ipc.on('importDataPackage', function(event, arg) {
      vueImportDataPackage(arg[0])
    })
    const vueValidateTable = this.validateTable
    ipc.on('validateTable', function(event, arg) {
      vueValidateTable()
    })
    this.pushDefaultPackageProperties()
  },
  updated: function() {
    if (this.loadingDataMessage && this.loadingDataMessage.length > 0) {
      document.querySelector('.modal1').classList.remove('modalHide')
    }
  }
}
</script>
<style scoped>
@import '~bootstrap/dist/css/bootstrap.min.css'
</style>
<style scoped>
@import '~components-font-awesome/css/font-awesome.min.css'
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
