<template>
<div id="container" class="container-fluid">

  <h1>Validation Errors</h1>

  <h2>Errors</h2>
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
import {ipcRenderer as ipc} from 'electron'
import {getHomeWindow} from '../index.js'
export default {
  name: 'errors',
  data() {
    return {
      messages: false
    }
  },
  computed: {
    // cache main window
    homeWindow() {
      return getHomeWindow()
    }
  },
  methods: {
    goToCell: function() {
      this.homeWindow.webContents.send('showErrorCell', {row: 1, column: 1})
      // this.getErrorMessages()
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
      this.errorMessages = errorMessages
    }
  },
  mounted: function() {
    const vueSetErrorMessages = this.setErrorMessages
    ipc.on('errorMessages', function(event, arg) {
      console.log('message returned')
      console.log(arg)
      vueSetErrorMessages(arg)
    })
  },
  watch: {
    messages: function() {
      console.log(messsages)
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
