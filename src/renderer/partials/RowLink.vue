<template>
  <td :class="gClass">
    <a href="#"
      @mouseover="hoverToSelectErrorCell(row)"
      @mouseout="exitHoverToSelectErrorCell(row)">
      {{value}}
    </a>
  </td>
</template>
<script>
import { getWindow } from '../index.js'
export default {
  name: 'rowLink',
  props: ['gClass', 'row', 'value'],
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
