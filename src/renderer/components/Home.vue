<template>
<div id="container" class="panel panel-group">
  <div id="header-panel" class="panel-heading">
    <nav class="navbar navbar-default">
      <div class="container-fluid">
        <div class="navbar-header">
          <a class="navbar-brand">Data Curator</a>
        </div>
        <div id="toolbar">
          <ul class="nav navbar-nav">
            <li v-for="(menu, index) in toolbarMenus" :key="index" :class="{ 'active': menuIndex === index}" @click="updateMenu(index)">
              <a href="#">
                <i v-if="menu.icon" class="fa" :class="menu.icon" aria-hidden="true" />
                <object v-if="menu.image" :class="menu.class" id="column-properties-svg" :data="menu.image" type="image/svg+xml" />
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
          <component :is="sideNavView">
          </component>
        </transition>
        <div v-show="sideNavPosition === 'right'" id="sidenav-footer" class="panel-footer">
          <a href="#" class="left" @click.prevent="sideNavLeft"><span class="btn fa fa-chevron-left fa-2x" /></a>
          <a href="#" class="right" @click.prevent="sideNavRight"><span class="btn fa fa-chevron-right fa-2x" /></a>
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
                    <span v-if="tabs.length > 1" class="tabclose btn-danger fa fa-times" @click.stop="closeTab"></span>
                  </a>
                </li>
              </ul>
            </li>
            <li class="tab-add" @click="addTab">
              <a>&nbsp;<button type="button" class="btn btn-sm">+</button></a>
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
      <div id="main-bottom-panel" class="panel-footer">
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
  HotRegister
} from '../hot.js'
import about from '../partials/About'
import preferences from '../partials/Preferences'
import column from '../partials/ColumnProperties'
import default1 from '../partials/Default1Properties'
import default2 from '../partials/Default2Properties'
import tabular from '../partials/TableProperties'
import packager from '../partials/PackageProperties'
import provenance from '../partials/ProvenanceProperties'
window.$ = window.jQuery = require('jquery/dist/jquery.js')
// const {
//   shell
// } = require('electron')
var ipc = require('electron').ipcRenderer
require('bootstrap/dist/js/bootstrap.min.js')
// require('jquery-csv/src/jquery.csv.js')
require('lodash/lodash.min.js')
require('../menu.js')
export default {
  name: 'home',
  data() {
    return {
      menuIndex: -1,
      sideNavPosition: 'right',
      sideNavStatus: 'closed',
      sideNavView: '',
      sideNavViewTitle: '',
      sideNavTransition: '',
      enableTransition: false,
      toolbarMenus: [{
        name: 'Validate',
        image: '/static/img/validate.svg',
        sideNavPosition: 'right',
        sideNavView: 'default1'
      },
      {
        name: 'Column',
        image: '/static/img/column-properties.svg',
        sideNavPosition: 'right',
        sideNavView: 'column'
      },
      {
        name: 'Table',
        image: '/static/img/table-properties.svg',
        sideNavPosition: 'right',
        sideNavView: 'tabular'
      },
      {
        name: 'Provenance',
        image: '/static/img/provenance-information.svg',
        sideNavPosition: 'right',
        sideNavView: 'provenance'
      },
      {
        name: 'Package',
        image: '/static/img/data-package-properties.svg',
        sideNavPosition: 'right',
        sideNavView: 'package'
      },
      {
        name: 'Export',
        image: '/static/img/export.svg',
        class: 'down',
        sideNavPosition: 'right',
        sideNavView: 'default2'
      }
      ]
    }
  },
  computed: {
    ...mapGetters({
      tabs: 'getTabs',
      activeTab: 'getActiveTab',
      tabIndex: 'getTabIndex',
      tabTitle: 'getHotTitle'
    }),
    ...mapGetters(['getPreviousTabId']),
    sideNavPropertiesForMain() {
      return this.sideNavStatus === 'closed' ? this.sideNavStatus : this.sideNavPosition
    },
    sideNavProperties() {
      return `${this.sideNavStatus} ${this.sideNavPosition}`
    }
  },
  methods: {
    ...mapMutations([
      'pushTab',
      'pushHotTab',
      'removeTab',
      'setTabs',
      'setActiveTab',
      'incrementTabIndex'
    ]),
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
      this.setActiveTab(nextTabId)
      this.pushTab(nextTabId)
    },
    loadDefaultDataIntoContainer: function(container) {
      let defaultData = '"","",""'
      this.loadDataIntoContainer(container, defaultData)
    },
    loadDataIntoContainer: function(container, data) {
      let defaultFormat = require('../../renderer/file-actions.js').formats.csv
      HotRegister.register(container)
      addHotContainerListeners(container)
      let activeHotId = this.getActiveHotId()
      let activeTabId = this.activeTab
      console.log('active hot is: ' + activeHotId)
      this.pushHotTab({
        'hotId': activeHotId,
        'tabId': activeTabId
      })
      loadData(activeHotId, data, defaultFormat)
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
    updateTransitions: function(index, maxIndex) {
      if (this.menuIndex === 0 && index === maxIndex) {
        this.sideNavTransition = 'sideNav-left'
      } else if (this.menuIndex === maxIndex && index === 0) {
        this.sideNavTransition = 'sideNav-right'
      } else if (index < this.menuIndex) {
        this.sideNavTransition = 'sideNav-left'
      } else if (index > this.menuIndex) {
        this.sideNavTransition = 'sideNav-right'
      } else {
        // console.log('same toolbar selection...')
      }
    },
    updateMenu: function(index) {
      if (this.sideNavStatus === 'closed' || this.menuIndex === -1) {
        this.enableTransition = false
      } else {
        this.updateTransitions(index, this.toolbarMenus.length - 1)
        this.enableTransition = true
      }
      let menu = this.toolbarMenus[index]
      this.menuIndex = index
      this.sideNavPosition = menu.sideNavPosition
      this.sideNavView = menu.sideNavView
      this.sideNavViewTitle = menu.name
      this.openSideNav()
    },
    sideNavLeft: function() {
      let leftIndex = (this.menuIndex - 1) > -1 ? this.menuIndex - 1 : this.toolbarMenus.length - 1
      this.updateMenu(leftIndex)
    },
    sideNavRight: function() {
      let rightIndex = (this.menuIndex + 1) < this.toolbarMenus.length ? this.menuIndex + 1 : 0
      this.updateMenu(rightIndex)
    },
    createTabId: function(tabId) {
      return `tab${tabId}`
    },
    getActiveHotId: function() {
      return $('#csvContent .active .editor').attr('id')
    },
    triggerSideNav(properties) {
      this.menuIndex = -1
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
    default1,
    default2,
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
      console.log('.........................')
      console.log('inside Vue ready tick....')
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
      console.log('leaving Vue ready tick....')
      console.log('.........................')
    })
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
