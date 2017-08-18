<template>
<div id="container" class="panel panel-group">
  <div id="header-panel" class="panel-heading">
    <nav class="navbar navbar-default">
      <div class="container-fluid">
        <div class="navbar-header">
          <a class="navbar-brand" href="#">Data Curator</a>
        </div>
        <div id="toolbar">
          <ul class="nav navbar-nav">
            <li v-for="(menu, index) in toolbarMenus" :key="index" :class="{ 'active': menuIndex === index}" @click="updateMenu(index)">
              <a href="#">
                <i v-if="menu.icon" class="fa" :class="menu.icon" aria-hidden="true" />
                <object v-if="menu.image" :class="menu.class" id="column-properties-svg" :data="menu.image" type="image/svg+xml" />
                <div>{{menu.name}}</div>
              </a>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  </div>
  <div id="body-panel" class="panel">
    <nav id="sidenav" class="sidenav navbar navbar-default row" :class="updateSideNav">
      <div class="container-fluid">
        <div class="navbar-header">
          <ul class="nav navbar-right closebtn">
            <li>
              <a href="#">
                <span class="btn-danger fa fa-times" @click="closeSideNav" />
              </a>
            </li>
          </ul>
          <a class="navbar-brand" href="#">
            {{sideNavView}}
          </a>
        </div>
        <transition :name="sideNavTransition" mode="out-in">
          <component :is="sideNavView" >
          </component>
        </transition>
        <div v-show="sideNavPosition === 'right'" id="sidenav-footer" class="panel-footer">
          <a href="#" class="left" @click.prevent="sideNavLeft">&lt;</a>
          <a href="#" class="right" @click.prevent="sideNavRight">&gt;</a>
        </div>
      </div>
    </nav>
    <div id="main-panel" class="panel panel-default" :class="updateMainFromSideNav">
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
window.$ = window.jQuery = require('jquery/dist/jquery.js')
const {
  shell
} = require('electron')
var ipc = require('electron').ipcRenderer
require('bootstrap/dist/js/bootstrap.min.js')
require('jquery-csv/src/jquery.csv.js')
require('lodash/lodash.min.js')
require('../menu.js')
let sideNavDefaultTemplate =
`<form class="navbar-form form-horizontal" id="tableProperties">
<div class="form-group-sm row container-fluid">
  <div v-for="(formprop, index) in formprops" :key="index" >
    <label class="control-label col-sm-4" :for="formprop.label">{{formprop.label}}:</label>
    <input type="text" class="form-control input-sm col-sm-8" :id="formprop.label" />
  </div>
</div>
</form>`
export default {
  name: 'home',
  data() {
    return {
      menuIndex: 0,
      sideNavPosition: 'right',
      sideNavStatus: 'closed',
      sideNavView: 'default',
      sideNavTransition: '',
      toolbarMenus: [{
        name: 'Validate',
        icon: 'fa-check-circle',
        sideNavPosition: 'right',
        sideNavView: 'default'
      },
      {
        name: 'Column',
        image: '/static/img/column-properties.svg',
        sideNavPosition: 'right',
        sideNavView: 'column'
      },
      {
        name: 'Table',
        icon: 'fa-table',
        sideNavPosition: 'right',
        sideNavView: 'tablular'
      },
      {
        name: 'Provenance',
        icon: 'fa-file-text-o',
        sideNavPosition: 'right',
        sideNavView: 'provenance'
      },
      {
        name: 'Package',
        icon: 'fa-gift',
        sideNavPosition: 'right',
        sideNavView: 'package'
      },
      {
        name: 'Export',
        image: '/static/img/export.svg',
        class: 'down',
        sideNavPosition: 'right',
        sideNavView: 'default2'
      }]
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
    updateMainFromSideNav() {
      return this.sideNavStatus === 'closed' ? this.sideNavStatus : this.sideNavPosition
    },
    updateSideNav() {
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
    addTab: function() {
      console.log('.........................')
      console.log('inside addTab function....')
      this.incrementTabIndex()
      let nextTabId = this.createTabId(this.tabIndex)
      this.setActiveTab(nextTabId)
      this.pushTab(nextTabId)
      this.$nextTick(function() {
        console.log('.........................')
        console.log('...next tick')
        // update latest tab object with content
        this.loadDefaultDataIntoContainer($('.editor:last')[0])
        console.log('.........................')
      })
      console.log('leaving addTab function....')
      console.log('.........................')
    },
    loadDefaultDataIntoContainer: function(container) {
      let defaultData = '"","",""'
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
      loadData(activeHotId, defaultData, defaultFormat)
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
        console.log('close triggered...')
        let targetTabId = $(event.currentTarget).parents("[id^='tab']").attr('id')
        console.log(`target tab id: ${targetTabId}`)
        // remove the closed tab from the array
        console.log(this.tabs)
        this.removeTab(targetTabId)
        this.cleanUpTabDependencies(targetTabId)
      }
    },
    closeSideNav: function() {
      this.sideNavStatus = 'closed'
      $('.closebtn').hide()
    },
    openSideNav: function() {
      this.sideNavStatus = 'open'
      $('.closebtn').delay(200).show(0)
    },
    updateMenu: function(index) {
      console.log(`current index is ${this.menuIndex}`)
      console.log(`incoming index is ${index}`)
      let maxIndex = this.toolbarMenus.length - 1
      if (this.menuIndex === 0 && index === maxIndex) {
        console.log('transitioning left...')
        this.sideNavTransition = 'sideNav-left'
      } else if (this.menuIndex === maxIndex && index === 0) {
        console.log('transitioning right...')
        this.sideNavTransition = 'sideNav-right'
      } else if (index < this.menuIndex) {
        console.log('transitioning left...')
        this.sideNavTransition = 'sideNav-left'
      } else if (index > this.menuIndex) {
        console.log('transitioning right...')
        this.sideNavTransition = 'sideNav-right'
      } else {
        console.log('same toolbar selection...')
      }
      let menu = this.toolbarMenus[index]
      this.menuIndex = index
      console.log(`current index now is ${this.menuIndex}`)
      this.sideNavPosition = menu.sideNavPosition
      this.sideNavView = menu.sideNavView
      this.openSideNav()
    },
    sideNavLeft: function() {
      let leftIndex = (this.menuIndex - 1) > -1 ? this.menuIndex - 1 : this.toolbarMenus.length -1
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
      this.sideNavPosition = properties.sideNavPosition || 'left'
      this.sideNavTransition = properties.sideNavTransition || 'left'
      this.sideNavView = properties.sideNavView
      this.sideNavStatus = 'open'
    }
  },
  components: {
    about: {
      template: `<div id="tableProperties">
        About
      </div>`
    },
    default: {
      data: function() {
        return {
          formprops: [{
            label: 'name'
          },
          {
            label: 'title'
          },
          {
            label: 'description'
          },
          {
            label: 'licence'
          }
          ]
        }
      },
      template: sideNavDefaultTemplate
    },
    default2: {
      data: function() {
        return {
          formprops: [{
            label: 'name2'
          },
          {
            label: 'title2'
          },
          {
            label: 'description2'
          },
          {
            label: 'licence2'
          }
          ]
        }
      },
      template: sideNavDefaultTemplate
    },
    column: {
      data: function() {
        return {
          formprops: [{
            label: 'name'
          },
          {
            label: 'title'
          },
          {
            label: 'description'
          },
          {
            label: 'type',
            type: 'dropdown'
          },
          {
            label: 'format',
            type: 'dropdown'
          },
          {
            label: 'rdfType',
            type: 'url'
          },
          {
            label: 'contraints',
            type: 'json'
          }
          ]
        }
      },
      template: sideNavDefaultTemplate
    },
    tablular: {
      data: function() {
        return {
          formprops: [{
            label: 'title'
          },
          {
            label: 'name'
          },
          {
            label: 'profile'
          },
          {
            label: 'description'
          },
          {
            label: 'sources',
            type: 'dropdown'
          },
          {
            label: 'licences',
            type: 'dropdown'
          },
          {
            label: 'format'
          },
          {
            label: 'mediatype'
          },
          {
            label: 'encoding'
          }
          ]
        }
      },
      template: sideNavDefaultTemplate
    },
    package: {
      data: function() {
        return {
          formprops: [{
            label: 'name',
            type: 'input'
          },
          {
            label: 'id',
            type: 'input'
          },
          {
            label: 'licenses',
            type: 'json'
          },
          {
            label: 'profile'
          },
          {
            label: 'title',
            type: 'input'
          },
          {
            label: 'description',
            type: 'markdown'
          },
          {
            label: 'version',
            type: 'input'
          },
          {
            label: 'sources',
            type: 'json'
          }
          ]
        }
      },
      template: sideNavDefaultTemplate
    },
    provenance: {
      data: function() {
        return {
          formprops: [{
            label: 'description',
            type: 'markdown'
          }]
        }
      },
      template: sideNavDefaultTemplate
    }
  },
  mounted: function() {
    const vueAddTab = this.addTab
    const vueUpdateMenu = this.updateMenu
    const vueTriggerSideNav = this.triggerSideNav
    ipc.on('addTab', function() {
      console.log('tab add clicked...')
      vueAddTab()
    })
    ipc.on('showAboutPanel', function() {
      console.log('about clicked...')
      vueTriggerSideNav({sideNavView: 'about'})
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
