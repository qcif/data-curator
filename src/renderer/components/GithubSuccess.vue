<template>
  <div id="container" class="container-fluid">
  <h2>Congratulations!</h2>

  <p>Your data is published at <a href="#" id="pages-url"></a></p>
  </div>
</template>
<script>
window.$ = window.jQuery = require('jquery/dist/jquery.js')
const {
  shell
} = require('electron')
var ipc = require('electron').ipcRenderer
require('bootstrap/dist/js/bootstrap.min.js')
ipc.once('ghPagesUrl', function(event, url) {
  $('#pages-url').attr('href', url)
  $('#pages-url').html(url)
})

$(document).on('click', 'a[href^="http"]', function(event) {
  event.preventDefault()
  shell.openExternal(this.href)
})
export default {
  name: 'githubsuccess',
  methods: {}
}
</script>
<style scoped>
@import '~bootstrap/dist/css/bootstrap.min.css'
</style>
<style scoped>
@import '~components-font-awesome/css/font-awesome.min.css'
</style>
<style scoped>
@import '/static/css/default.styl'
</style>
<style scoped>
@import '~handsontable/dist/handsontable.full.css'
</style>
<style scoped>
@import '~static/css/panels.css'
</style>
<style lang="styl" scoped>
@import '~static/css/panel'
</style>
