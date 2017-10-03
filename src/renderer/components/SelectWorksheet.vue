<template>
<div id="container" class="container-fluid">
  <form>
    <p>
      <select id="worksheets" v-model="selected" class="form-control">
        <option v-for="option in options" v-bind:value="option.value">
          {{ option.text }}
        </option>
      </select>
    </p>
    <div class="well">
      <button id="submit" class="btn btn-default" @click.prevent="submit">Open Sheet</button> <button id="cancel" class="btn btn-default" @click.prevent="cancel">Cancel</button>
    </div>
  </form>
</div>
</template>
<script>
var ipc = require('electron').ipcRenderer
require('bootstrap/dist/js/bootstrap.min.js')
export default {
  name: 'selectworksheet',
  data() {
    return {
      selected: '',
      options: [
      ]
    }
  },
  methods: {
    submit: function() {
      console.log('submitting...')
      ipc.send('worksheetSelected', this.selected)
    },
    cancel: function() {
      console.log('cancelling...')
      ipc.send('worksheetCanceled')
    },
    updateSelected: function(selected) {
      console.log('got update...')
      this.selected = selected
    }
  },
  mounted: function() {
    const vueOptions = this.options
    const vueUpdateSelected = this.updateSelected
    ipc.on('loadSheets', function(e, sheets) {
      sheets.forEach(function(sheet, index) {
        vueOptions.push({text: sheet, value: sheet})
        vueUpdateSelected(sheet)
      })
    })
    ipc.on('addTabWithData', function(e, data) {
      console.log('whoops!')
    })
  }
}
</script>
<style scoped>
@import '~bootstrap/dist/css/bootstrap.min.css'
</style>
<style lang="styl" scoped>
@import '~static/css/select-worksheet'
</style>
