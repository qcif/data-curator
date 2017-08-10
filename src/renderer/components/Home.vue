<template>
<div id="container" class="panel panel-group">
  <div id="header-panel" class="panel-heading">
    <nav class="navbar navbar-default">
      <div class="container-fluid">
        <div class="navbar-header">
          <button type="button" class="navbar-toggle" data-toggle="collapse" data-target="#toolbar">
            <span class="icon-bar"></span>
            <span class="icon-bar"></span>
            <span class="icon-bar"></span>
          </button>
          <a class="navbar-brand" href="#">Data-curator</a>
        </div>
        <div class="collapse navbar-collapse" id="toolbar">
          <ul class="nav navbar-nav">
            <li v-for="(menu, index) in toolbarMenus" :key="index" :class="{ 'active': menuIndex === index}" @click="updateMenu(index, menu.navPosition)">
              <a href="#">
                <i class="fa" :class="menu.icon" aria-hidden="true" />
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
            Panel Heading
          </a>
          <button id="tablePropertiesBtn" type="button" class="navbar-toggle" data-toggle="collapse" data-target="#tableProperties">
            <span class="icon-bar"></span>
            <span class="icon-bar"></span>
            <span class="icon-bar"></span>
          </button>
        </div>
        <form class="navbar-form form-horizontal collapse navbar-collapse" id="tableProperties">
          <div class="form-group-sm row container-fluid">
            <div>
              <label class="control-label col-sm-4" for="name">Name:</label>
              <input type="text" class="form-control input-sm col-sm-8" id="name" />
            </div>
            <div>
              <label class="control-label col-sm-4" for="title">Title:</label>
              <input type="text" class="form-control input-sm col-sm-8" id="title" />
            </div>
            <div>
              <label class="control-label col-sm-4" for="description">Description:</label>
              <input type="text" class="form-control input-sm col-sm-8" id="description" />
            </div>
            <div>
              <label class="control-label col-sm-4" for="licence">License:</label>
              <input type="text" class="form-control input-sm col-sm-8" id="licence" />
            </div>
          </div>
        </form>
      </div>
    </nav>
    <div id="main-panel" class="panel panel-default" :class="updateMainFromSideNav">
      <!-- <div id="main-top-panel" class="panel panel-heading"></div> -->
      <div id="main-middle-panel" class="panel panel-body">
        <div id='csvEditor' v-model='tabs'>
          <ul class="nav nav-tabs">
            <li>
              <ul class="nav nav-tabs" id='csvTab'>
                <li v-for="tab in tabs" :id="tab" :key="tab" :class="{ active: activeTab == tab}" @click="activeTab = tab">
                  <a><span>{{tab}}</span><span class="tabclose btn-danger fa fa-times" @click="closeTab"></span></a>
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
  setActiveTabId,
  getActiveTabId
} from '../tabs.js'
import * as Sortable from 'sortablejs/Sortable.js'
import {
  loadDefaultDataIntoContainer
} from '../index.js'
import Rx from 'rxjs/Rx'
import {
  DOM
} from 'rx-dom'
window.$ = window.jQuery = require('jquery/dist/jquery.js')
const {
  shell
} = require('electron')
var ipc = require('electron').ipcRenderer
require('bootstrap/dist/js/bootstrap.min.js')
require('jquery-csv/src/jquery.csv.js')
require('lodash/lodash.min.js')
require('../menu.js')
export default {
  name: 'home',
  data() {
    return {
      activeTab: '',
      tabIndex: -1,
      tabs: [],
      menuIndex: 0,
      navPosition: 'right',
      navStatus: 'closed',
      toolbarMenus: [{
        name: 'Find and Replace',
        icon: 'fa-table',
        navPosition: 'right'
      },
      {
        name: 'Validate',
        icon: 'fa-check-circle',
        navPosition: 'right'
      },
      {
        name: 'Column',
        icon: 'fa-search',
        navPosition: 'right'
      },
      {
        name: 'Table',
        icon: 'fa-table',
        navPosition: 'right'
      },
      {
        name: 'Provenance',
        icon: 'fa-file-text-o',
        navPosition: 'right'
      },
      {
        name: 'Package',
        icon: 'fa-gift',
        navPosition: 'left'
      },
      {
        name: 'Export',
        icon: 'fa-search',
        navPosition: 'right'
      },
      {
        name: 'Publish',
        icon: 'fa-cloud-upload',
        navPosition: 'right'
      }
      ]
    }
  },
  computed: {
    updateMainFromSideNav() {
      return this.navStatus === 'closed' ? this.navStatus : this.navPosition
    },
    updateSideNav() {
      return `${this.navStatus} ${this.navPosition}`
    }
  },
  methods: {
    addTab: function() {
      console.log('.........................')
      console.log('inside addTab function....')
      // add tab first to trigger element creation
      this.tabIndex += 1
      // let nextTab = {id: this.createTabId(this.tabIndex), content: ''}
      let nextTabId = this.createTabId(this.tabIndex)
      this.activeTab = nextTabId
      this.tabs.push(nextTabId)
      console.log('recalculated....')
      this.$nextTick(function() {
        console.log('.........................')
        console.log('...next tick')
        console.log('.....active from watch is: ')
        console.log($('.editor').length)
        // update latest tab object with content
        loadDefaultDataIntoContainer($('.editor:last')[0])
        // console.log('data loaded at end of next tick')
        console.log(`id is: ` + $('.editor:last').attr('id'))
        // console.dir(this.tabs)
        // console.log('latest tab is:')
        // console.log(this.tabs[this.tabIndex].id)
        // console.log(this.tabs[this.tabIndex].content)
        // console.log('done')
        // // let latestTab = this.tabs[this.tabs.length - 1]
        // console.log(`next tab id is: ${nextTab.id}`)
        // console.log(nextTab)
        // nextTab.content = $('.editor:last').attr('id')
        // // let latestTab = {id: `${this.tabIndex}`, content: `${$('.editor:last').attr('id')}`}
        console.log('updated latest tab is:')
        console.log(this.tabs[this.tabIndex])
        // console.log(this.tabs[this.tabIndex].content)
        // this.tabs.push(latestTab)
        console.log(this.tabs)
        // console.log('tab ids....')
        // console.log(this.tabs[this.tabs.length-1])
        console.log('.........................')
      })
      console.log('leaving addTab function....')
      console.log('.........................')
    },
    closeTab: function(event) {
      let tabsLength = this.tabsLength
      // console.log(e)
      let targetTabId = $(event.currentTarget).parents("[id^='tab']").attr('id')
      console.log($(event.currentTarget).parents("[id^='tab']").attr('id'))
      let targetTabPosition = $.inArray(targetTabId, this.tabs)
      console.log(targetTabPosition)
      this.tabs.splice(targetTabPosition, 1)
      let nextActiveTabPos = targetTabPosition < 1 ? 0 : targetTabPosition - 1
      this.activeTab = this.tabs[nextActiveTabPos]
      console.log(this.activeTab)
      // var element = e.target
      // console.log($(element).parent("[id^='tab']"))
      // if (tabsLength > 1) {
      //   this.tabIndex -= 1
      //
      // } else if (tabsLength < 1) {
      //   this.tabIndex = 0
      //   this.tabs = []
      // } else {
      //   console.log('Keeping tab at 1.')
      // }
    // }
    },
    closeSideNav: function() {
      console.log('closing side nav...')
      this.navStatus = 'closed'
      $('.closebtn').hide()
    },
    openSideNav: function() {
      this.navStatus = 'open'
      $('.closebtn').delay(200).show(0)
    },
    updateMenu: function(index, navPosition) {
      this.menuIndex = index
      this.navPosition = navPosition
      this.openSideNav()
    },
    createTabId: function(tabId) {
      return `tab${tabId}`
    },
    updateTabs: function(tabIdOrder) {
      console.log(tabIdOrder)
      console.log('checking...')
      console.log(this.tabs)
      this.tabs = tabIdOrder
      console.log(this.tabs)
    }
  },
  components: {},
  mounted: function() {
    // DOM.fromMutationObserver(document.getElementById('csvTab'), {
    //   childList: true
    // }).subscribe(function(mutations) {
    //   mutations.forEach(function(mutation) {
    //     console.log('Type of mutation: ' + mutation.type)
    //     console.dir(mutation)
    //     if (mutation.type == 'childList') {
    //       mutation.target.childNodes.forEach(function(child) {
    //         console.log(child.id)
    //       })
    //     }
    //   })
    // })
    this.$nextTick(function() {
      console.log('.........................')
      console.log('inside Vue ready tick....')
      require('../index.js')
      let tabIdOrder
      const vueUpdateTabs = this.updateTabs
      Sortable.create(csvTab, {
        animation: 150,
        onSort: function(/** Event */ evt) {
          console.log('dragged!')
          tabIdOrder = $("#csvTab [id^='tab']").map(function() {
            return this.id
          }).get()
          vueUpdateTabs(tabIdOrder)
        }
      })
      this.closeSideNav()
      this.addTab()
      console.log(`nav pos: ${this.navPosition}`)
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
