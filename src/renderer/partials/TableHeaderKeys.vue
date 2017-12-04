<template>
  <select v-model="selectedKeys" class="form-control input-sm col-sm-9" multiple>
    <option v-for="columnName in activeNames" :value="columnName">{{columnName}}</option>
  </select>
</template>
<script>
export default {
  name: 'tableheaderkeys',
  props: ['activeNames', 'getSelectedKeys', 'pushSelectedKeys'],
  computed: {
    selectedKeys: {
      get: function() {
        return this.getSelectedKeys || []
      },
      set: function(values) {
        this.pushSelectedKeys(values)
      }
    }
  }
}
</script>
