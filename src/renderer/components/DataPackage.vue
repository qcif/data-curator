<template>
  <div id="container" class="container-fluid">
  <form id="datapackage">
    <div class="form-wrapper">
      <div class="form-group">
        <label for="title">Dataset title</label>
        <input type="text" class="form-control" id="title" name="title" placeholder="Dataset title" autofocus>
      </div>
      <div class="form-group">
        <label for="name">Dataset name</label>
        <input type="text" class="form-control" id="name" name="name" placeholder="Dataset name">
      </div>
      <div class="form-group">
        <label for="description">Dataset description</label>
        <textarea class="form-control" id="description" name="description" rows="3"></textarea>
      </div>
<!-- this would be an ideal place to link to in-app help -->
      <div class="form-group">
        <label for="license">License</label>
<!-- to be sourced from http://opendefinition.org/licenses/#recommended-conformant-licenses plus other selected open licenses -->
        <select id="license" name="license" class="form-control">
          <option value="">Please select...</option>
          <option value="cc-by">Creative Commons Attribution 4.0 (CC-BY-4.0)</option>
          <option value="cc-by-sa">Creative Commons Attribution Share-Alike 4.0 (CC-BY-SA-4.0)</option>
          <option value="cc-zero">Creative Commons CCZero (CC0)</option>
          <option value="pdm">Public Domain</option>
          <option value="odc-by">Open Data Commons Attribution License (ODC-BY)</option>
          <option value="odc-odbl">Open Data Commons Open Database License (ODbL)</option>
          <option value="odc-pddl">Open Data Commons Public Domain Dedication and Licence (PDDL)</option>
          <option disabled role=separator> ─── </option>
          <option value="ogl-ca">Open Government Licence Canada 2.0</option>
          <option value="ogl-tw">Open Government License Taiwan</option>
          <option value="ogl-uk">Open Government Licence United Kingdom (OGL-UK)</option>
        </select>
      </div>
      <div class="form-group">
        <label for="keywords">Keywords (Comma separated)</label><br />
        <input type="text" id="keywords" class="form-control" data-role="tagsinput" name="keywords">
      </div>
      <div id="headers">
        <label>Generate Headers?</label>
        <input type="radio" name="group1" value="true" checked="checked" /> Yes
        <input type="radio" name="group1" value="false" /> No<br />
        <p id="status" />
      </div>
    </div>
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
require('bootstrap-tagsinput/dist/bootstrap-tagsinput.min.js')
jQuery.fn.serializeObject = function() {
  var arrayData, objectData
  arrayData = this.serializeArray()
  objectData = {}

  $.each(arrayData, function() {
    var value

    if (this.value != null) {
      value = this.value
    } else {
      value = ''
    }

    if (objectData[this.name] != null) {
      if (!objectData[this.name].push) {
        objectData[this.name] = [objectData[this.name]]
      }

      objectData[this.name].push(value)
    } else {
      objectData[this.name] = value
    }
  })

  return objectData
}

// integrating the schema generation

$(function () {
  var rGrp = $('input[name=group1]')
  rGrp.click(function () {
    var checkedRadio = rGrp.filter(':checked')
    console.log(checkedRadio.val())
  })
})

$('#submit').click(function(e) {
  datapackage = $('#datapackage').serializeObject()
  // serialise the wizard from the div
  var includeHeaders = headerOptionClicked()
  // retrieve a value for headers from the radio box
  ipc.send('sendDatapackage', datapackage, includeHeaders)
})

$('#cancel').click(function() {
  ipc.send('datapackageCanceled')
})

$('#title').on('input keyup', function() {
  title = $(this).val()
  $('#name').val(slugify(title))
})

$('#keywords').on('beforeItemAdd', function(event) {
  event.item = event.item.trim()
  items = $('#keywords').tagsinput('items')
  if ($.inArray(event.item, items) != -1) event.cancel = true
})

function headerOptionClicked() {
  var rGrp = $('input[name=group1]')
  if (rGrp.filter(':checked')['length'] > 0) {
    var includeHeaders = rGrp.filter(':checked').val()
  } else {
    includeHeaders = false
  }
  return includeHeaders
}

function slugify(text) {
  return text.toString().toLowerCase()
    .replace(/\s+/g, '-') // Replace spaces with -
    .replace(/[^\w-]+/g, '') // Remove all non-word chars
    .replace(/--+/g, '-') // Replace multiple - with single -
    .replace(/^-+/, '') // Trim - from start of text
    .replace(/-+$/, '') // Trim - from end of text
}
export default {
  name: 'datapackage',
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
@import '~bootstrap-tagsinput/dist/bootstrap-tagsinput.css'
</style>
<style scoped>
@import '/static/css/datapackage.css'
</style>
