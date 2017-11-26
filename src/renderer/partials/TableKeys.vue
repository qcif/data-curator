<template>
  <select v-model="selectedTableKeys" class="form-control input-sm col-sm-9">
    <option v-for="tableName in activeTableNames" :value="tableName">{{tableName}}</option>
  </select>
</template>
<script>
export default {
  name: 'tablekeys',
  props: ['activeTableNames', 'selectedTableKeys']
}
</script>
