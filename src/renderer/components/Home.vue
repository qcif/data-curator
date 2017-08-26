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
                <div class="toolbar-text">{{menu.name}}</div>
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
                <span v-show="sideNavStatus === 'open'" class="btn fa fa-times" @click="closeSideNav" />
              </a>
            </li>
          </ul>
          <a class="navbar-brand" href="#">
            {{sideNavView}}
          </a>
        </div>
        <transition :name="sideNavTransition" mode="out-in" :css="enableTransition">
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
    <label :style="{paddingLeft: '0'}" class="control-label col-sm-4" :for="formprop.label">{{formprop.label}}:</label>
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
      enableTransition: false,
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
        sideNavView: 'export'
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
      if (this.sideNavStatus === 'open') {
        this.updateTransitions(index, this.toolbarMenus.length - 1)
        this.enableTransition = true
      } else {
        this.enableTransition = false
      }
      let menu = this.toolbarMenus[index]
      this.menuIndex = index
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
      this.enableTransition = properties.enableTransition || false
      this.sideNavStatus = 'open'
    }
  },
  components: {
    about: {
      data: function() {
        return {
          aboutListStyle: {
            fontWeight: 'bold',
            textAlign: 'center',
            border: 'none'
          },
          listStyle: {
            'paddingLeft': '0'
          },
          listItemStyle: {
            'paddingLeft': '5px'
          },
          aboutProps: [
            {
              items: [
                {
                  image: '/static/img/data-curator-120.png'
                },
                {
                  label: 'Data Curator',
                  style: {fontSize: '24px', color: '#0ca831'}
                },
                {
                  label: 'create usable open data',
                  style: {fontSize: '16px', color: '#0ca831'}
                },
                {
                  label: '1.0.0'
                }
              ]
            },
            {
              items: [
                {
                  image: '/static/img/advance_qld_logo.png',
                  link: 'http://advance.qld.gov.au/',
                  height: '48px'
                },
                {
                  label: 'Funded by the Queensland Government'
                }
              ]
            },
            {
              items: [
                {
                  image: '/static/img/odi_aus_logo.png',
                  link: 'https://theodi.org.au/',
                  height: '48px'
                },
                {
                  label: 'Project coordinated by the ODI Australian Network'
                }
              ]
            },
            {
              items: [
                {
                  image: '/static/img/qcif_logo.png',
                  link: 'https://www.qcif.edu.au',
                  height: '60px'
                },
                {label: 'Includes software developed by the Queensland Cyber Infrastructure Foundation on behalf of the Queensland Government and the ODI Australian Network'}
              ]
            }
          ]
        }
      },
      template: `
      <div id="aboutProperties" class="panel-group">
        <ul class="list-group" v-for="(list, index) in aboutProps" :key="index">
          <li :style="aboutListStyle" class="list-group-item" v-for="(item, index) in list.items" :key="index">
            <template v-if="item.image">
              <a v-if="item.link" :href="item.link"><img :height="item.height" width="auto" :src="item.image" /></a>
              <img v-else :src="item.image" />
            </template>
            <template v-if="item.label">
              <a :style="item.style" v-if="item.link" :href="item.link">{{item.label}}</a>
              <span :style="item.style" v-else>{{item.label}}</span>
            </template>
          </li>
        </ul>
        <ul :style="listStyle">We acknowledge the great work of others. We are:
          <li :style="listItemStyle">inspired by the <a href="https://theodi.org/">ODI</a> experiment, <a href="https://comma-chameleon.io/">Comma Chameleon</a></li>
          <li :style="listItemStyle">using the <a href="https://okfn.org/">Open Knowledge International</a> Frictionless Data <a href="http://frictionlessdata.io/">specification</a> and <a href="http://frictionlessdata.io/tools/#javascript">code libraries</a></li>
          <li :style="listItemStyle">adopting <a href="https://www.w3.org/TR/dwbp/#bp-summary">W3C Data on the Web Best Practices</a></li>
          <li :style="listItemStyle">proudly using <a href="https://github.com/ODIQueensland/data-curator/blob/master/README.md">open source software</a></li>
        </ul>
        <div>
          Learn how you can <a href="https://github.com/ODIQueensland/data-curator/blob/master/.github/CONTRIBUTING.md">contribute to Data Curator</a>
        </div>
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
    export: {
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
    const vueAddTabWithData = this.addTabWithData
    ipc.on('addTabWithData', function(e, data) {
      vueAddTabWithData(data)
    })
    const vueAddTab = this.addTab
    ipc.on('addTab', function() {
      vueAddTab()
    })
    const vueTriggerSideNav = this.triggerSideNav
    ipc.on('showAboutPanel', function() {
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
