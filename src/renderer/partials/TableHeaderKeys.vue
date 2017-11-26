<template>
  <select v-model="selectedKeys" class="form-control input-sm col-sm-9" multiple>
    <option v-for="columnName in activeNames" :value="columnName">{{columnName}}</option>
  </select>
</template>
<script>
export default {
  name: 'tableheaderkeys',
  props: ['activeNames', 'selectedKeys']
}
</script>
