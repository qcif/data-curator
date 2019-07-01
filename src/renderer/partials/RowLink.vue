<template>
  <div v-show="row && row.hasOwnProperty('message')">
    <span
      v-for="column in columns"
      :key="column.field">
      <a
        v-show="row && row.hasOwnProperty(column)"
        href="#"
        @mouseover="hoverToSelectErrorCell(row)"
        @mouseout="exitHoverToSelectErrorCell(row)">
        {{ row.rowNumber }}
      </a>
    </span>
  </div>
</template>
<script>
import { getWindow } from '../index.js'
export default {
  name: 'RowLink',
  props: {
    row: {
      type: Object,
      default: function() { return {} }
    },
    columns: {
      type: Object,
      default: function() { return {} }
    }
  },
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
