<template>
  <div id="container" class="container-fluid">
  <form id="custom-format">
    <div class="form-wrapper">

      <div class="form-group">
        <label for="separator">Separator</label>
        <input type="text" class="form-control" id="separator" name="separator" value=",">
      </div>

      <div class="form-group">
        <label for="delimiter">Text Delimiter</label>
        <input type="text" class="form-control" id="delimiter" name="delimiter" value='"'>
      </div>

    </div>

    <div class="well">
      <button id="submit" class="btn btn-default">Go</button>
      <button id="cancel" class="btn btn-default">Cancel</button>
    </div>
  </form>
  </div>
</template>
<script>
window.$ = window.jQuery = require('jquery/dist/jquery.js')
const {
  shell
} = require('electron')
var ipc = require('electron').ipcRenderer
require('bootstrap/dist/js/bootstrap.min.js')
$(function () {
  $('#cancel').click(function(e) {
    window.close()
  })

  $('#submit').click(function(e) {
    e.preventDefault()
    format = {
      separator: $('#separator').val(),
      delimiter: $('#delimiter').val()
    }
    ipc.send('formatSelected', format)
  })
})
export default {
  name: 'customformat',
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
@import '/static/assets/css/default.css'
</style>
<style scoped>
@import '/static/assets/css/datapackage.css'
</style>
