<template>
  <div v-show="row && row.hasOwnProperty('message')">
    <span v-for="column in columns" class="column.cellClass || 'center-align'">
        <a href="#" v-show="row && row.hasOwnProperty(column)"
        @mouseover="hoverToSelectErrorCell(row)"
        @mouseout="exitHoverToSelectErrorCell(row)">
        {{row.rowNumber}}
      </a>
    </span>
  </div>
</template>
<script>
import { getWindow } from '../index.js'
export default {
  name: 'rowLink',
  props: ['row', 'columns'],
  computed: {
    // cache main window
    homeWindow() {
      return getWindow('home')
    }
  },
  methods: {
    hoverToSelectErrorCell: function(row) {
      this.homeWindow.webContents.send('hoverToSelectErrorCell', row)
    },
    exitHoverToSelectErrorCell: function(row) {
      this.homeWindow.webContents.send('exitHoverToSelectErrorCell', row)
    }
  }
}
</script>
