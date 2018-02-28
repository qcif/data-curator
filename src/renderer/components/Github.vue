<template>
  <div id="container" class="container-fluid">
  <h2>Congratulations!</h2>

  <p>Your data is published at <a href="#" id="pages-url"></a></p>
  </div>
</template>
<script>
const {
  shell
} = require('electron')
var ipc = require('electron').ipcRenderer
ipc.once('apiKey', function(event, akey) {
  var key = akey
  $('#submit').click(function(e) {
    e.preventDefault()
    $('#spinner').removeClass('hidden')
    github = $('#github').find(':input').serialize()
    ipc.send('sendToGithub', github, key)
  })

  $('#name').on('input keyup', function() {
    title = $(this).val()
    $('#file_name').val(title)
  })

  $('#description').on('input keyup', function() {
    description = $(this).val()
    $('#file_description').val(description)
  })
})

$('#cancel').click(function(e) {
  window.close()
})

ipc.once('errors', function(event, errors) {
  $('#errors').removeClass('hidden')
  text = '<p><strong>Sorry, there were some errors:</strong></p>'
  if (errors.class == String) {
    e = errors.split(',')
  }
  text += errors.join('<br>')
  $('#errors').html(text)
})
export default {
  name: 'github',
  methods: {}
}
</script>
