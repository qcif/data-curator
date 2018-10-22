<template>
  <div>
  <span class="center-align">
    <a href="#"
      @mouseover="hoverToSelectErrorCell(row)"
      @mouseout="exitHoverToSelectErrorCell(row)">
      {{row.rowNumber}}
    </a>
  </span>
  <span class="center-align">
    <a href="#"
      @mouseover="hoverToSelectErrorCell(row)"
      @mouseout="exitHoverToSelectErrorCell(row)">
      {{row.columnNumber}}
    </a>
  </span>
  <span class="left-align">
    <a href="#"
      @mouseover="hoverToSelectErrorCell(row)"
      @mouseout="exitHoverToSelectErrorCell(row)">
      {{row.message}}
    </a>
  </span>
</div>
</template>
<script>
import { getWindow } from '../index.js'
export default {
  name: 'rowLink',
  props: ['row'],
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
