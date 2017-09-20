<template>
<div id="container" class="container-fluid">
  <form id="github">
    <div class="form-wrapper">
      <div class="alert alert-danger hidden" role="alert" id="errors"></div>

      <div class="form-group">
        <label for="file_name">File name</label>
        <input type="text" class="form-control" id="file_name" name="file_name">
      </div>

      <div class="form-group">
        <label for="file_description">File description</label>
        <textarea class="form-control" id="file_description" name="file_description"></textarea>
      </div>

      <div class="form-group">
        <label class="control-label" for="repos">Choose Dataset</label>
        <select class="form-control" id="dataset" name="dataset">
          <option>--- Please Select---</option>
        </select>
      </div>

    </div>
    <div class="well">
      <button id="submit" class="btn btn-default">Go
        <i id='spinner' class="fa fa-spinner fa-pulse margin-bottom hidden"></i></button>
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
ipc.once('apiKey', function(event, akey) {
  var key = akey
  var rootURL = process.env.NODE_ENV == 'development' ? 'http://git-data-publisher.dev' : 'https://octopub.io'

  $.ajax({
    url: rootURL + '/api/user/datasets.json',
    type: 'GET',
    beforeSend: function(xhr) { xhr.setRequestHeader('Authorization', key) },
    success: function(data) {
      select = $('#dataset')
      $.each(data, function(i, repo) {
        select.append($('<option></option>')
          .attr('value', repo.id)
          .text(repo.name))
      })

      $('#submit').click(function(e) {
        e.preventDefault()
        $('#spinner').removeClass('hidden')
        github = $('#github').find(':input').serialize()
        ipc.send('addFileToExisting', github, key)
      })
    }
  })
})

ipc.once('errors', function(event, e) {
  $('#spinner').addClass('hidden')
  $('#errors').removeClass('hidden')
  text = '<p><strong>Sorry, there were some errors:</strong></p>'
  if (e.class == String) {
    errors = e.split(',')
  }
  text += e.join('<br>')
  $('#errors').html(text)
})
export default {
  name: 'chooserepo',
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
@import '~bootstrap-tagsinput/dist/bootstrap-tagsinput.css'
</style>
<style scoped>
@import '/static/css/datapackage.css'
</style>
