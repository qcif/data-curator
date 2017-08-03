<template>
<div id="container" class="panel-group">
  <div id="header-panel" class="panel panel-heading">
    <nav class="navbar navbar-default">
      <div class="container-fluid">
        <div class="navbar-header">
          <a class="navbar-brand" href="#">Data-curator</a>
        </div>
        <ul class="nav navbar-nav">
          <li v-for="(menu, index) in toolbarMenus" :key="index" :class="{ active: menu === index}" v-on:click="menu = index">
            <a href="#" v-on:click="openNav">{{menu}}</a>
          </li>
        </ul>
      </div>
    </nav>
  </div>
  <div id="body-panel">
    <!-- <div  class="sidenav"> -->
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
          <!-- Heading -->
        </div>
        <form class="navbar-form">
          <div class="form-group">
            <label for="name">Name:</label>
            <input type="text" class="form-control" id="name" />
            <label for="title">Title:</label>
            <input type="text" class="form-control" id="title" />
            <label for="description">Description:</label>
            <input type="text" class="form-control" id="description" />
            <label for="licence">License:</label>
            <input type="text" class="form-control" id="licence" />
          </div>
        </form>
      </div>
    </nav>
    <!-- </div> -->
    <div id="main-panel" class="panel panel-default">
      <div id="main-top-panel" class="panel-heading"></div>
      <div id="main-middle-panel" class="panel-body">
        <div id='csvEditor' v-model='tabCount'>
          <ul class="nav nav-tabs">
            <li>
              <ul class="nav nav-tabs" id='csvTab'>
                <li v-for="(count, index) in tabCount" :key="count" :class="{ active: tab === count}" v-on:click="tab = count">
                  <a>Tab {{count}}</a>
                </li>
              </ul>
            </li>
            <li class="tab-add" v-on:click="addTab">
              <a>&nbsp;<button type="button" class="btn btn-sm">+</button></a>
            </li>
          </ul>
          <div class="tab-content" id='csvContent'>
            <div class="tab-pane" v-for="(count, index) in tabCount" :key="count " :class="{ active: tab === count}">
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
        <div id="message-panel" class="panel panel-default">
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
      tab: 1,
      tabCount: 1,
      toolbarMenus: [
        'Find and Replace',
        'Validate',
        'Column',
        'Table',
        'Provenance',
        'Package',
        'Export',
        'Publish'
      ],
      menu: 0
    }
  },
  computed: {},
  methods: {
    addTab: function() {
      this.tabCount += 1
      // console.log('tab is: ' + this.tab)
      // console.log('tab count is: ' + this.tabCount)
      this.activeTab = this.tabCount
      console.log('recalculating...')
      console.log('active id is first: ' + $('.tab-pane.active .editor').attr('id'))
      require('../index.js').loadDefaultDataIntoContainer($('.tab-pane .editor:last')[0])
      // setActiveTabId($('.tab-pane.active .editor').attr('id'))
      console.log('active id is now: ' + $('.tab-pane.active .editor').attr('id'))
      console.log('tab count is: ' + this.tabCount)
    },
    /* Set the width of the side navigation to 0 and the left margin of the page content to 0 */
    closeNav: function() {
      $('#sidenav').css('width', '0')
      $('#main-panel').css('margin-right', '0')
      $('#main-panel').css('width', '100%')
      $('.closebtn').hide()
    },
    /* Set the width of the side navigation to 250px and the left margin of the page content to 250px */
    openNav: function() {
      $('#sidenav').css('width', '30%')
      $('#main-panel').css('width', '70%')
      // enable flyout panel to begin display before showing close button
      $('.closebtn').delay(200).show(0)
    }
  },
  watch: {
    tab: {
      handler: function(val, oldValue) {
        $(document).ready(function() {
          console.log('active from watch is: ')
          console.log($('.active .editor'))
          setActiveTabId($('.active .editor').attr('id'))
        })
      }
    }
  },
  components: {},
  mounted: function() {
    this.$nextTick(function() {
      require('../index.js')
      Sortable.create(csvTab, {
        animation: 150
      })
      this.closeNav.hide()
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
<style scoped>
@import '/static/assets/css/default.css'
</style>
<style scoped>
@import '~handsontable/dist/handsontable.full.css'
</style>
<style scoped>
@import '/static/assets/css/panels.css'
</style>
