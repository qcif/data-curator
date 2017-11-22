<template>
  <select v-model="selectedTableKeys" class="form-control input-sm col-sm-9">
    <option v-for="tableName in activeTableNames" :value="tableName">{{tableName}}</option>
  </select>
</template>
<script>
import RelationKeys from '../mixins/RelationKeys'
export default {
  name: 'tablekeys',
  mixins: [RelationKeys],
  data() {
    return {
      selectedTableKeys: [],
      activeTableNames: []
    }
  },
  watch: {},
  methods: {

  }
}
</script>
