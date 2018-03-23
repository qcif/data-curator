<template>
<div id="container" class="container-fluid">

  <h1>Errors</h1>

  <div>
   <vue-good-table
     :columns="columns"
     :rows="rows"
     :paginate="true"
     :defaultSortBy="{field: 'row', type: 'asc'}"
     :onClick="goToCell"
    styleClass="table condensed table-bordered table-striped"/>
 </div>

</div>
</template>
<script>
import Vue from 'vue'
import VueGoodTable from 'vue-good-table'
import {ipcRenderer as ipc} from 'electron'
import {getWindow} from '../index.js'
Vue.use(VueGoodTable)
export default {
  name: 'errors',
  data() {
    return {
      messages: false,
      columns: [
        {
          label: 'Row number',
          field: 'rowNumber',
          filterable: true,
          type: 'number'
        },
        {
          label: 'Column number',
          field: 'columnNumber',
          filterable: true,
          type: 'number'
        },
        {
          label: 'Error message',
          field: 'message',
          filterable: true
        }
      ],
      rows: [
      ]
    }
  },
  computed: {
    // cache main window
    homeWindow() {
      return getWindow('home')
    }
  },
  methods: {
    goToCell: function(error) {
      this.homeWindow.webContents.send('showErrorCell', {row: error.rowNumber, column: error.columnNumber})
    },
    hoverToSelectErrorCell: function() {
      this.homeWindow.webContents.send('hoverToSelectErrorCell', {row: 1, column: 1})
    },
    exitHoverToSelectErrorCell: function() {
      this.homeWindow.webContents.send('exitHoverToSelectErrorCell', {row: 1, column: 1})
    },
    getErrorMessages: function() {
      this.homeWindow.webContents.send('getErrorMessages')
    },
    setErrorMessages: function(errorMessages) {
      this.messages = errorMessages
    }
  },
  mounted: function() {
    const vueSetErrorMessages = this.setErrorMessages
    ipc.on('errorMessages', function(event, arg) {
      if (_.isArray(arg)) {
        vueSetErrorMessages(arg)
      }
    })
    this.getErrorMessages()
  },
  watch: {
    messages: function(messages) {
      this.rows = []
      for (let next of messages) {
        this.rows.push({rowNumber: next.rowNumber, columnNumber: next.columnNumber, message: next.message})
      }
    }
  }
}
</script>
<style scoped>
@import '~components-font-awesome/css/font-awesome.min.css'
</style>
<style lang="styl" scoped>
@import '~static/css/keyboard-help'
</style>
