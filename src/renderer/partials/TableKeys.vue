<template>
  <select class="form-control input-sm col-sm-9" :value="getSelectedTable" @input="pushSelectedTable($event.target.value)">
    <option v-for="tableName in allTables" :key="tableName" :id="tableName" :value="tableName">{{tableName}}</option>
  </select>
</template>
<script>
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
