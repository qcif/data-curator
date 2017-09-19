<template>
<div id="container" class="panel panel-group">
  <div id="header-panel" class="panel-heading">
    <nav class="navbar navbar-default">
      <div class="container-fluid">
        <div class="navbar-header">
          <a class="navbar-brand"></a>
        </div>
        <div id="toolbar">
          <ul class="nav navbar-nav">
            <li v-for="(menu, index) in toolbarMenus" :key="index" :class="{ 'active': toolbarIndex === index}" @click="updateToolbarMenu(index)">
              <a href="#">
                <i v-if="menu.icon" class="fa" :class="menu.icon" aria-hidden="true" />
                <object v-if="menu.image" :class="menu.class" :data="menu.image" type="image/svg+xml" />
                <div class="toolbar-text">{{menu.name}}</div>
              </a>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  </div>
  <div id="body-panel" class="panel">
    <nav id="sidenav" class="sidenav navbar navbar-default row" :class="sideNavProperties">
      <div class="container-fluid">
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
          <component :is="sideNavView" :getAllColumnsProperties="getColumnPropertiesMethod" :cIndex="currentColumnIndex">
          </component>
        </transition>
        <div v-show="sideNavPosition === 'right'" id="sidenav-footer" class="panel-footer">
          <a v-if="enableSideNavLeftArrow" href="#" class="left" @click.prevent="sideNavLeft"><span class="btn fa fa-chevron-left fa-2x" /></a>
          <span v-else class="left disabled" ><span class="btn fa fa-chevron-left fa-2x" /></span>
          <a v-if="enableSideNavRightArrow" href="#" class="right" @click.prevent="sideNavRight"><span class="btn fa fa-chevron-right fa-2x" /></a>
          <span v-else class="right disabled" ><span class="btn fa fa-chevron-right fa-2x" /></span>
        </div>
      </div>
    </nav>
    <div id="main-panel" class="panel panel-default" :class="sideNavPropertiesForMain">
      <!-- <div id="main-top-panel" class="panel panel-heading"></div> -->
      <div id="main-middle-panel" class="panel panel-body">
        <div id='csvEditor'>
          <ul class="nav nav-tabs">
            <li>
              <ul class="nav nav-tabs" id='csvTab'>
                <li v-for="tab in tabs" :id="tab" :key="tab" :class="{active: activeTab == tab}" @click="setActiveTab(tab)">
                  <a>
                    <span>{{tabTitle(tab)}}</span>
                    <span v-if="tabs.length > 1" class="tabclose btn-default fa fa-times" @click.stop="closeTab"></span>
                  </a>
                </li>
              </ul>
            </li>
            <li class="tab-add" @click="addTab">
              <a>&nbsp;<button type="button" class="btn btn-sm"><i class="fa fa-plus"></i></button></a>
            </li>
          </ul>
          <div class="tab-content" id='csvContent'>
            <div class="tab-pane" v-for="tab in tabs" :key="tab" :class="{ active: activeTab == tab}">
              <div class="editor">
              </div>
            </div>
          </div>
        </div>
      </div>
      <div v-show="showBottomPanel" id="main-bottom-panel" class="panel-footer">
        <button type="button" class="close">
          <span aria-hidden="true">&times;</span>
        </button>
        <div id="message-panel" class="panel-default">
        </div>
      </div>
    </div>
  </div>
  <div id="footer-panel" class="panel panel-footer">
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
  guessColumnProperties
} from '../frictionless.js'
window.$ = window.jQuery = require('jquery/dist/jquery.js')
var ipc = require('electron').ipcRenderer
require('bootstrap/dist/js/bootstrap.min.js')
require('lodash/lodash.min.js')
require('../menu.js')
export default {
  name: 'home',
  data() {
    return {
      currentColumnIndex: 0,
      // only set method when ready
      getColumnPropertiesMethod: this.getAllColumnsProperties(),
      toolbarIndex: -1,
      sideNavPosition: 'right',
      sideNavStatus: 'closed',
      sideNavView: '',
      sideNavViewTitle: '',
      sideNavTransition: '',
      enableTransition: false,
      enableSideNavLeftArrow: true,
      enableSideNavRightArrow: true,
      showBottomPanel: false,
      toolbarMenus: [{
        name: 'Validate',
        image: 'static/img/validate.svg'
      },
      {
        name: 'Column',
        image: 'static/img/column-properties.svg',
        sideNavPosition: 'right',
        sideNavView: 'column'
      },
      {
        name: 'Table',
        image: 'static/img/table-properties.svg',
        sideNavPosition: 'right',
        sideNavView: 'tabular'
      },
      {
        name: 'Provenance',
        image: 'static/img/provenance-information.svg',
        sideNavPosition: 'right',
        sideNavView: 'provenance'
      },
      {
        name: 'Package',
        image: 'static/img/data-package-properties.svg',
        sideNavPosition: 'right',
        sideNavView: 'packager'
      },
      {
        name: 'Export',
        image: 'static/img/export.svg',
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
    ...mapGetters(['getPreviousTabId', 'getHotColumnProperties', 'tabTitle']),
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
      'setTabs',
      'setActiveTab',
      'incrementTabIndex',
      'pushHotColumns',
      'pushTabTitle'
    ]),
    selectionListener: function() {
      console.log('selection noted in vue')
      this.updateActiveColumn()
      this.resetSideNavArrows()
      console.log('selection noted finished in vue')
    },
    getAllColumnsProperties: function() {
      console.log('getting property....')
      let hot = HotRegister.getActiveInstance()
      if (hot) {
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
      console.log('captured properties are:')
      console.log('hotColumns')
      this.pushHotColumns(hotColumns)
    },
    addTabWithFormattedData: function(data, format) {
      this.initTab()
      this.$nextTick(function() {
        // update latest tab object with content
        this.loadFormattedDataIntoContainer($('.editor:last')[0], data, format)
      })
    },
    addTabWithData: function(data) {
      this.initTab()
      this.$nextTick(function() {
        // update latest tab object with content
        this.loadDataIntoContainer($('.editor:last')[0], data)
      })
    },
    addTab: function() {
      this.initTab()
      this.$nextTick(function() {
        // update latest tab object with content
        this.loadDefaultDataIntoContainer($('.editor:last')[0])
      })
    },
    initTab: function() {
      this.incrementTabIndex()
      let nextTabId = this.createTabId(this.tabIndex)
      this.pushTabTitle({id: nextTabId, index: this.tabIndex})
      this.setActiveTab(nextTabId)
      this.pushTab(nextTabId)
      console.log(`this tabIndex is ${this.tabIndex}`)
    },
    loadDefaultDataIntoContainer: function(container) {
      let defaultData = '"","",""'
      this.loadDataIntoContainer(container, defaultData)
    },
    loadDataIntoContainer: function(container, data) {
      let defaultFormat = require('../../renderer/file-actions.js').formats.csv
      this.loadFormattedDataIntoContainer(container, data, defaultFormat)
    },
    loadFormattedDataIntoContainer: function(container, data, format) {
      HotRegister.register(container, this.selectionListener)
      addHotContainerListeners(container)
      // let activeHotId = this.getActiveHotId()
      let activeHotId = HotRegister.getActiveInstance().guid
      let activeTabId = this.activeTab
      console.log('active hot is: ' + activeHotId)
      this.pushHotTab({
        'hotId': activeHotId,
        'tabId': activeTabId
      })
      loadData(activeHotId, data, format)
    },
    cleanUpTabDependencies: function(tabId) {
      // update active tab
      if (tabId === this.activeTab) {
        let targetTabIndex = _.indexOf(this.tabs, tabId)
        let previousTabId = this.getPreviousTabId(targetTabIndex)
        this.setActiveTab(previousTabId)
      }
      // update hots

      // update hottabs

      // update tab titles
    },
    closeTab: function(event) {
      // do not allow single tab to be closed
      if (this.tabs.length > 1) {
        let targetTabId = $(event.currentTarget).parents("[id^='tab']").attr('id')
        // remove the closed tab from the array
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
      console.log('updated active column')
      this.getColumnPropertiesMethod = this.getAllColumnsProperties()
    },
    updateToolbarMenuForColumn: function(index) {
      let maxColAllowed = getColumnCount() -1
      console.log(`max allowed: ${maxColAllowed}`)
      let currentColIndex = getCurrentColumnIndexOrMax()
      console.log(`currentColIndex: ${currentColIndex}`)
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
      console.log('updating tool menu...')
      if (this.isSideNavToolbarMenu(index)) {
        this.updateToolbarMenuForSideNav(index)
      } else {
        this.toolbarIndex = index
        this.closeSideNav()
      }
    },
    updateToolbarMenuFromArrows: function(index) {
      console.log(`side nav view before: ${this.sideNavView}`)
      if (this.sideNavView === 'column') {
        this.updateToolbarMenuForColumn(index)
      } else if (index > 0) {
        this.updateToolbarMenu(index)
      }
    },
    sideNavLeft: function() {
      let nextIndex = this.toolbarIndex - 1
      console.log(`next index: ${nextIndex}`)
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
    // getActiveHotId: function() {
    //   return $('#csvContent .active .editor').attr('id')
    // },
    triggerSideNav(properties) {
      this.toolbarIndex = -1
      this.sideNavPosition = properties.sideNavPosition || 'left'
      this.sideNavTransition = properties.sideNavTransition || 'left'
      this.sideNavView = properties.sideNavView
      this.sideNavViewTitle = properties.name || properties.sideNavView
      this.enableTransition = properties.enableTransition || false
      this.sideNavStatus = 'open'
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
    this.$nextTick(function() {
      require('../index.js')
      let tabIdOrder
      const vueSetTabs = this.setTabs
      Sortable.create(csvTab, {
        animation: 150,
        onSort: function(evt) {
          console.log('dragged!')
          tabIdOrder = $("#csvTab [id^='tab']").map(function() {
            return this.id
          }).get()
          vueSetTabs(tabIdOrder)
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
  },
  watch: {
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
