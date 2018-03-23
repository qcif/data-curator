<template>
<div id="container" class="container-fluid">

  <h1>Validation Errors</h1>

  <h2>Errors</h2>
  <div>
   <vue-good-table
     title="Demo Table"
     :columns="columns"
     :rows="rows"
     :paginate="true"
     :defaultSortBy="{field: 'row', type: 'asc'}"
     :lineNumbers="false"/>
 </div>
  <table class="table table-striped">
    <thead>
      <tr>
        <th style="width:50%">Table Editing shortcuts</th>
        <th style="width:25%"><i class="fa fa-windows"></i> &nbsp; <i class="fa fa-linux"></i></th>
        <th style="width:25%"><i class="fa fa-apple"></i></th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><b>Testing</b>, errors</td>
        <td><kbd>  <a href="#" @click.prevent="goToCell()"
        @mouseover="hoverToSelectErrorCell()"
        @mouseout="exitHoverToSelectErrorCell()">
        Enter</a></kbd></td>
        <td><kbd>Enter</kbd></td>
      </tr>
    </tbody>
  </table>

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
    goToCell: function() {
      this.homeWindow.webContents.send('showErrorCell', {row: 1, column: 1})
      this.getErrorMessages()
      // ipc.send('focusMainWindow')
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
      console.log('message returned')
      if (_.isArray(arg)) {
        vueSetErrorMessages(arg)
      }
    })
  },
  watch: {
    messages: function(messages) {
      this.rows = []
      for (let next of messages) {
        console.log(next)
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
