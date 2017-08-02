<template>
<div id="container" class="">
  <div id="top-panel">
  </div>
  <div id="main-panel">
    <div id="left-panel">
    </div>
    <div id="middle-panel">
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
            <a>&nbsp;
              <button type="button" class="btn btn-sm">+</button>
            </a>
          </li>
        </ul>
        <div class="tab-content" id='csvContent'>
          <div class="tab-pane" v-for="(count, index) in tabCount" :key="count " :class="{ active: tab === count}">
            <div class="editor">
            </div>
          </div>
        </div>
      </div>
      <!-- <div class="fly">
        A Basic Panel
      </div> -->
    </div>
    <div id="right-panel" class="hidden alert" role="alert">
      <button type="button" class="close" data-dismiss="alert" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      <div id="message-panel">
      </div>
    </div>
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
