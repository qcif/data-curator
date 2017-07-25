<template>
<div id="container" class="">
  <div id="top-panel"></div>
  <div id="main-panel">
    <div id="left-panel">
    </div>
    <div id="middle-panel">
      <div id="editor"></div>
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
  methods: {},
  mounted: function() {
    this.$nextTick(function() {
      require('../index.js')
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
