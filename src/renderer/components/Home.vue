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
            <!--              <a href="#" v-tooltip="tooltip(menu.tooltipId)"> -->
              <a href="#">
                <i v-if="menu.icon" class="fa" :class="menu.icon" aria-hidden="true" />
                <object v-if="menu.image" :class="menu.class" :data="menu.image" type="image/svg+xml" />
                <div class="toolbar-text">{{menu.name}}</div>
              </a>
              <!--              <component :is="menu.tooltipView" /> -->
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
        <!-- <div class="row"> -->
        <transition :name="sideNavTransition" mode="out-in" :css="enableTransition">
          <component :is="sideNavView" :getAllColumnsProperties="getColumnPropertiesMethod" :cIndex="currentColumnIndex">
          </component>
        </transition>
        <!-- </div> -->
        <!-- <div class="row"/> -->
        <div v-show="sideNavPosition === 'right'" id="sidenav-footer" class="panel-footer row">
          <a v-if="enableSideNavLeftArrow" href="#" class="left" @click.prevent="sideNavLeft"><span class="btn fa fa-chevron-left fa-2x" /></a>
          <span v-else class="left disabled"><span class="btn fa fa-chevron-left fa-2x" /></span>
          <!-- <component v-if="enableSideNavLeftArrow" is="tooltipPrevious" /> -->
          <a v-if="enableSideNavRightArrow" href="#" class="right" @click.prevent="sideNavRight"><span class="btn fa fa-chevron-right fa-2x" /></a>
          <span v-else class="right disabled"><span class="btn fa fa-chevron-right fa-2x" /></span>
          <!-- <component v-if="enableSideNavRightArrow" is="tooltipNext" /> -->
        </div>
        <!-- </div> -->
    </nav>
    <div id="main-panel" class="panel panel-default" :class="sideNavPropertiesForMain">
      <!-- <div id="main-top-panel" class="panel panel-heading"></div> -->
      <div id="main-middle-panel" class="panel panel-body">
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
            <!--        <li class="tab-add" @click="addTab" v-tooltip="tooltip('tooltip-add-tab')"> -->
            <li class="tab-add" @click="addTab">
              <a>&nbsp;<button type="button" class="btn btn-sm"><i class="fa fa-plus"></i></button></a>
            </li>
            <!--        <component is="tooltipAddTab" /> -->
          </ul>
          <div class="tab-content" id='csvContent'>
            <div class="tab-pane" v-for="tab in tabs" :key="tab" :class="{ active: activeTab == tab}">
              <div class="editor">
              </div>
            </div>
          </div>
        </div>
      </div>
      <div id="main-bottom-panel" class="panel-footer">
        <div id="message-panel" class="panel-default">
          <div v-show="errorMessages && errorMessages.length > 0">
            <ul class="nav navbar-right closebtn">
              <li>
                <a href="#" @click="closeErrorMessages()">
                  <span style="color:#000" class="btn-default fa fa-times" />
                </a>
              </li>
            </ul>
            <h3>Validation errors</h3>
            <div v-for="errorMessage in errorMessages">
              <span>row no.{{errorMessage.rowNumber}}</span><span>: {{errorMessage.message}}</span>
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
  reselectCurrentCellOrMax,
  incrementActiveColumn,
  decrementActiveColumn,
  getActiveSelected
} from '../hot.js'
import about from '../partials/About'
import preferences from '../partials/Preferences'
import column from '../partials/ColumnProperties'
import tabular from '../partials/TableProperties'
import packager from '../partials/PackageProperties'
import provenance from '../partials/ProvenanceProperties'
import {
  guessColumnProperties,
  validateActiveDataWithNoSchema,
  validateActiveDataAgainstSchema
} from '../frictionless.js'
import HomeTooltip from '../mixins/HomeTooltip'
import {
  fileFormats
} from '../file-formats.js'
import {ipcRenderer as ipc} from 'electron'
import 'bootstrap/dist/js/bootstrap.min.js'
import 'lodash/lodash.min.js'
import '../menu.js'
export default {
  name: 'home',
  mixins: [HomeTooltip],
  data() {
    return {
      currentColumnIndex: 0,
      // only set method when ready
      getColumnPropertiesMethod: function() {},
      toolbarIndex: -1,
      sideNavPosition: 'right',
      sideNavStatus: 'closed',
      sideNavView: '',
      sideNavViewTitle: '',
      sideNavTransition: '',
      enableTransition: false,
      enableSideNavLeftArrow: true,
      enableSideNavRightArrow: true,
      errorMessages: false,
      loadingDataMessage: false,
      toolbarMenus: [{
        name: 'Validate',
        image: 'static/img/validate.svg',
        tooltipId: 'tooltip-validate',
        tooltipView: 'tooltipValidate'
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
        name: 'Export',
        image: 'static/img/export.svg',
        tooltipId: 'tooltip-export',
        tooltipView: 'tooltipExport',
        sideNavView: 'export'
      }
      ]
    }
  },
  computed: {
    ...mapGetters({
      tabs: 'getTabs',
      activeTab: 'getActiveTab',
      tabIndex: 'getTabIndex'
    }),
    ...mapGetters(['getPreviousTabId', 'getHotColumnProperties', 'tabTitle', 'getHotIdFromTabId']),
    sideNavPropertiesForMain() {
      return this.sideNavStatus === 'closed' ? this.sideNavStatus : this.sideNavPosition
    },
    sideNavProperties() {
      return `${this.sideNavStatus} ${this.sideNavPosition}`
    },
    toolbarMenuName() {
      return _.get(this.toolbarMenus[this.toolbarIndex], 'name')
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
      'destroyHotTab',
      'destroyTabObject'
    ]),
    closeErrorMessages: function() {
      for (let el of ['main-bottom-panel', 'main-middle-panel']) {
        document.getElementById(el).classList.remove('opened')
      }
      this.errorMessages = false
    },
    selectionListener: function() {
      this.updateActiveColumn()
      this.resetSideNavArrows()
    },
    getAllColumnsProperties: function() {
      let hot = HotRegister.getActiveInstance()
      if (hot) {
        let columnProps = this.getHotColumnProperties(hot.guid)
        return this.getHotColumnProperties(hot.guid)
      }
    },
    async updateColumnProperties() {
      let hotColumns
      try {
        hotColumns = await guessColumnProperties()
      } catch (err) {
        console.log(err)
      }
      this.pushHotColumns(hotColumns)
    },
    reportValidationRowErrors: function(errorCollection) {
      this.errorMessages = errorCollection
      for (let el of ['main-bottom-panel', 'main-middle-panel']) {
        document.getElementById(el).classList += ' opened'
      }
    },
    async validateTable() {
      try {
        await validateActiveDataAgainstSchema(this.reportValidationRowErrors)
      } catch (err) {
        console.log('There was an error(s) validating table.')
        console.log(err)
      }
    },
    latestHotContainer: function() {
      let allEditors = document.querySelectorAll('#csvContent .editor')
      return allEditors[allEditors.length - 1]
    },
    addTabWithFormattedData: function(data, format) {
      this.initTab()
      this.$nextTick(function() {
        this.loadFormattedDataIntoContainer(this.latestHotContainer(), data, format)
      })
    },
    addTabWithData: function(data) {
      this.initTab()
      this.$nextTick(function() {
        this.loadDataIntoContainer(this.latestHotContainer(), data)
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
    showLoadingScreen(message) {
      this.loadingDataMessage = message
    },
    closeLoadingScreen() {
      this.loadingDataMessage = false
    },
    loadFormattedDataIntoContainer: function(container, data, format) {
      HotRegister.register(container, {
        selectionListener: this.selectionListener,
        loadingStartListener: this.showLoadingScreen,
        loadingFinishListener: this.closeLoadingScreen
      })
      addHotContainerListeners(container)
      let activeHotId = HotRegister.getActiveInstance().guid
      let activeTabId = this.activeTab
      // hack! - force data to wait for latest render e.g, for loader message
      window.setTimeout(function() {
        loadData(activeHotId, data, format)
      }, 1)
      this.pushHotTab({
        'hotId': activeHotId,
        'tabId': activeTabId
      })
    },
    cleanUpTabDependencies: function(tabId) {
      // update active tab
      if (tabId === this.activeTab) {
        let targetTabIndex = _.indexOf(this.tabs, tabId)
        let previousTabId = this.getPreviousTabId(targetTabIndex)
        this.setActiveTab(previousTabId)
      }
      this.destroyTabObject(tabId)
      let hotId = this.getHotIdFromTabId(tabId)
      this.destroyHotTab(hotId)
      HotRegister.destroyHot(hotId)
    },
    closeTab: function(event) {
      // do not allow single tab to be closed
      if (this.tabs.length > 1) {
        let targetTabId = event.currentTarget.closest('.tab-header').id
        this.removeTab(targetTabId)
        this.cleanUpTabDependencies(targetTabId)
      }
    },
    closeSideNav: function() {
      this.enableTransition = false
      this.sideNavStatus = 'closed'
    },
    openSideNav: function() {
      this.sideNavStatus = 'open'
    },
    updateTransitions: function(index) {
      if (index < this.toolbarIndex) {
        this.sideNavTransition = 'sideNav-left'
      } else if (index > this.toolbarIndex) {
        this.sideNavTransition = 'sideNav-right'
      } else {
        // console.log('same toolbar selection...')
      }
    },
    isSideNavToolbarMenu(index) {
      let toolbarMenu = this.toolbarMenus[index]
      return toolbarMenu.sideNavPosition && toolbarMenu.sideNavView
    },
    resetSideNavArrows() {
      this.enableSideNavLeftArrow = true
      this.enableSideNavRightArrow = true
      if (this.sideNavView === 'column') {
        this.enableSideNavLeftArrow = getCurrentColumnIndexOrMax() > 0
      }
    },
    updateSideNavState() {
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
      if (!selected) {
        console.log('Cannot update active column without a column selected.')
      } else {
        let currentColumnIndex = selected[1]
        let guid = HotRegister.getActiveInstance().guid
        this.currentColumnIndex = currentColumnIndex
      }
      this.getColumnPropertiesMethod = this.getAllColumnsProperties()
    },
    updateToolbarMenuForColumn: function(index) {
      let maxColAllowed = getColumnCount() - 1
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
    updateToolbarMenu: function(index) {
      if (this.isSideNavToolbarMenu(index)) {
        this.updateToolbarMenuForSideNav(index)
      } else {
        this.toolbarIndex = index
        this.closeSideNav()
        if (index === 0) {
          this.validateTable()
        }
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
    triggerSideNav(properties) {
      this.toolbarIndex = -1
      this.sideNavPosition = properties.sideNavPosition || 'left'
      this.sideNavTransition = properties.sideNavTransition || 'left'
      this.sideNavView = properties.sideNavView
      this.sideNavViewTitle = properties.name || properties.sideNavView
      this.enableTransition = properties.enableTransition || false
      this.sideNavStatus = 'open'
    },
    forceWrapper: function() {
      this.$forceUpdate()
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
  },
  mounted: function() {
    const vueAddTabWithData = this.addTabWithData
    ipc.on('addTabWithData', function(e, data) {
      vueAddTabWithData(data)
    })
    const vueAddTabWithFormattedData = this.addTabWithFormattedData
    ipc.on('addTabWithFormattedData', function(e, data, format) {
      vueAddTabWithFormattedData(data, format)
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
  created: function() {
    const vueGuessProperties = this.updateColumnProperties
    ipc.on('guessColumnProperties', function(event, arg) {
      vueGuessProperties()
    })
    const vueValidateTable = this.validateTable
    ipc.on('validateTable', function(event, arg) {
      vueValidateTable()
    })
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
