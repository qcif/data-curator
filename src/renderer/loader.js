var $ = require('jquery/dist/jquery.js')

var showLoader = function(message) {
  console.log('showing...')
  $('#right-panel').removeClass('hidden')
  $('#message-panel').html('<div class="validation-load"><p><span class="glyphicon glyphicon-refresh spinning"></span></p><p>' + message + '</p></div>')
}

var hideLoader = function() {
  console.log('hiding...')
  $('#right-panel').addClass('hidden')
}

module.exports = {
  showLoader,
  hideLoader
}
