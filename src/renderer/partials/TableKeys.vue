<template>
  <select class="form-control input-sm col-sm-9" :value="getSelectedTable" @input="pushSelectedTable($event.target.value)">
    <option v-for="tableName in allTables" :key="tableName" :id="tableName" :value="tableName">{{tableName}}</option>
  </select>
</template>
<script>
import { Subscription } from 'rxjs/Subscription'
import {selectedForeignTable$} from '@/rxSubject.js'
import VueRx from 'vue-rx'
import Vue from 'vue'
Vue.use(VueRx, {
  Subscription
})
export default {
  name: 'tablekeys',
  props: ['allTableNames', 'pushSelectedTable', 'getSelectedTable'],
  data() {
    return {
      selectedForeignTable: ''
      //     debounceGetSelectedTable: _.debounce(function() { return this.getSelectedTable }, 100, {
      //       'leading': false,
      //       'trailing': true
      //     })
    }
  },
  computed: {
    allTables() {
      return this.allTableNames || []
    }
  },
  methods: {
    updateSelectedForeignTable: function(value) {
      console.log(`updating selected foreign table to: ${value}`)
      this.selectedForeignTable = value
      this.$forceUpdate()
    }
  },
  mounted: function() {
    let vueSelectedForeignTable = this.updateSelectedForeignTable
    this.$subscribeTo(selectedForeignTable$, function(selectedForeignTable) {
      console.log('received subscription to selected foreign table...')
      vueSelectedForeignTable(selectedForeignTable)
    })
  }
}
</script>
