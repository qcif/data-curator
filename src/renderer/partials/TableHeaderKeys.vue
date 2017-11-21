<template>
  <select v-model="selectedKeys" class="form-control input-sm col-sm-9" multiple>
    <option v-for="columnName in activeNames" :value="columnName">{{columnName}}</option>
  </select>
</template>
<script>
import TableKeys from '../mixins/TableKeys'
export default {
  name: 'tableheaderkeys',
  mixins: [TableKeys]
}
</script>
