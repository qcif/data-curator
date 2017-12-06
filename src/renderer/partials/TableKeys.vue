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
  computed: {
    allTables() {
      return this.allTableNames || []
    }
  }
}
</script>
