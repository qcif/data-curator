<template>
<div id="container" class="container-fluid">
  <form>
    <p><select id="worksheets" class="form-control"></select></p>
    <div class="well">
      <button id="submit" class="btn btn-default">Go</button> <button id="cancel" class="btn btn-default">Cancel</button>
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
export default {
  name: 'selectworksheet',
  methods: {},
  mounted: function() {
    ipc.on('loadSheets', function(e, sheets) {
      let worksheets = $('#worksheets')
      $.each(sheets, function(i, sheet) {
        worksheets.append($('<option></option>')
          .attr('value', sheet)
          .text(sheet))
      })
      $('#submit').click(function(e) {
        console.log('clicked and selected worksheet.')
        ipc.send('worksheetSelected', $('#worksheets').val())
        e.preventDefault()
      })
      $('#cancel').click(function() {
        ipc.send('worksheetCanceled')
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
@import '/static/css/default.styl'
</style>
<style scoped>
@import '/static/css/select-worksheet.css'
</style>
