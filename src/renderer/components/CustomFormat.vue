<!-- <template>
  <div id="container" class="container-fluid">
  <form id="custom-format" v-on:submit.prevent="submit()">
    <div class="form-wrapper">

      <div class="form-group">
        <label for="separator">Delimiter</label>
        <input type="text" class="form-control" id="delimiter" name="delimiter" :value="getDelimiter" @input="setDelimiter($event.target.value)" >
      </div>

      <div class="form-group">
        <label for="delimiter">Quote Character</label>
        <input type="text" class="form-control" id="quoteChar" name="quoteChar" :value="getQuoteChar" @input="setQuoteChar($event.target.value)">
      </div>

    </div>

    <div class="well">
      <button id="submit" class="btn btn-default">Go</button>
      <button id="cancel" class="btn btn-default" @click="cancel()">Cancel</button>
    </div>
  </form>
  </div>
</template>
<script>
const {
  shell
} = require('electron')
var ipc = require('electron').ipcRenderer

export default {
  name: 'customformat',
  computed: {
    getDelimiter() {
      return ','
      // TODO : couple to vuex
    },
    getQuoteChar() {
      return ','
      // TODO : couple to vuex
    }
  },
  methods: {
    setDelimiter(delimiter) {
      // TODO: complete
    },
    setQuoteChar(quoteChar) {
      // TODO: complete
    },
    submit() {
      let format = {
        delimiter: document.querySelector('#delimiter').val(),
        quoteChar: document.querySelector('#quoteChar').val()
      }
      ipc.send('formatSelected', format)
    },
    cancel() {
      window.close()
    }
  },
  mounted: function() {
  }
}
</script>
<style scoped>
@import '~components-font-awesome/css/font-awesome.min.css'
</style>
<style scoped>
@import '/static/css/datapackage.css'
</style> -->
