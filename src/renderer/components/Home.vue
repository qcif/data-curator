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
            <li v-for="(menu, index) in toolbarMenus" :key="index" :class="{ active: menu === index}" @click="menu = index">
                <i class="fa" :class="menu.icon" aria-hidden="true"/>
                <a href="#" @click="openNav">{{menu.name}}</a>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  </div>
  <div id="body-panel" class="panel">
    <nav id="sidenav" class="sidenav navbar navbar-default">
      <div class="container-fluid">
        <ul class="nav navbar-right closebtn">
          <li>
            <a href="#">
              <span class="btn-danger fa fa-times" @click="closeNav()" />
            </a>
          </li>
        </ul>
        <div class="navbar-header">
          <a class="navbar-brand" href="#">Panel Content</a>
          <button id="tablePropertiesBtn" type="button" class="navbar-toggle" data-toggle="collapse" data-target="#tableProperties">
            <span class="icon-bar"></span>
            <span class="icon-bar"></span>
            <span class="icon-bar"></span>
          </button>
        </div>
        <form class="navbar-form form-horizontal collapse navbar-collapse" id="tableProperties">
          <div class="form-group">
            <label class="control-label col-sm-4" for="name">Name:</label>
            <div class="col-sm-8"><input type="text" class="form-control" id="name" /></div>
            <label class="control-label col-sm-4" for="title">Title:</label>
            <div class="col-sm-8"><input type="text" class="form-control" id="title" /></div>
            <label class="control-label col-sm-4" for="description">Description:</label>
            <div class="col-sm-8"><input type="text" class="form-control" id="description" /></div>
            <label class="control-label col-sm-4" for="licence">License:</label>
            <div class="col-sm-8"><input type="text" class="form-control" id="licence" /></div>
          </div>
        </form>
      </div>
    </nav>
    <div id="main-panel" class="panel panel-default">
      <div id="main-top-panel" class="panel panel-heading"></div>
      <div id="main-middle-panel" class="panel panel-body">
        <div id='csvEditor' v-model='tabCount'>
          <ul class="nav nav-tabs">
            <li>
              <ul class="nav nav-tabs" id='csvTab'>
                <li v-for="(count, index) in tabCount" :key="count" :class="{ active: activeTab === count}" @click="activeTab = count">
                  <a><span>Tab {{count}}</span><span class="tabclose btn-danger fa fa-times" @click="closeTab"></span></a>
                </li>
              </ul>
            </li>
            <li class="tab-add" @click="addTab">
              <a>&nbsp;<button type="button" class="btn btn-sm">+</button></a>
            </li>
          </ul>
          <div class="tab-content" id='csvContent'>
            <div class="tab-pane" v-for="(count, index) in tabCount" :key="count" :class="{ active: activeTab === count}">
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
      activeTab: 1,
      tabCount: 1,
      toolbarMenus: [
        {name: 'Find and Replace', icon: 'fa-table'},
        {name: 'Validate', icon: 'fa-check-circle'},
        {name: 'Column', icon: 'fa-search'},
        {name: 'Table', icon: 'fa-table'},
        {name: 'Provenance', icon: 'fa-file-text-o'},
        {name: 'Package', icon: 'fa-gift'},
        {name: 'Export', icon: 'fa-search'},
        {name: 'Publish', icon: 'fa-cloud-upload'}
      ],
      menu: 0
    }
  },
  computed: {},
  methods: {
    addTab: function() {
      console.log('.........................')
      console.log('inside addTab function....')
      this.tabCount += 1
      this.activeTab = this.tabCount
      this.$nextTick(function() {
        console.log('.........................')
        console.log('...next tick')
        console.log('.....active from watch is: ')
        console.log($('.editor').length)
        require('../index.js').loadDefaultDataIntoContainer($('.editor:last')[0])
        console.log('data loaded at end of next tick')
        console.log('.........................')
      })
      console.log('leaving addTab function....')
      console.log('.........................')
    },
    closeTab: function() {
      if (this.tabCount > 0) {
        this.tabCount -= 1
      } else {
        this.tabCount = 0
      }
    },
    closeNav: function() {
      $('#sidenav').css('width', '0')
      $('#main-panel').css('margin-right', '0')
      $('#main-panel').css('width', '100%')
      $('.closebtn').hide()
    },
    openNav: function() {
      $('#sidenav').css('width', '40%')
      $('#main-panel').css('width', '60%')
      // enable flyout panel to begin display before showing close button
      $('.closebtn').delay(200).show(0)
    }
  },
  components: {},
  mounted: function() {
    this.$nextTick(function() {
      console.log('.........................')
      console.log('inside Vue ready tick....')
      require('../index.js')
      Sortable.create(csvTab, {
        animation: 150
      })
      this.closeNav()
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
