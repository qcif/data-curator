<template>
  <select v-model="selectedKeys" class="form-control input-sm col-sm-9" multiple>
    <!-- <select v-model="selectedKeys" :value="chooseSelectedKeys" @input="setSelectedKeys($event.target.value)" class="form-control input-sm col-sm-9" multiple> -->
    <option v-for="columnName in activeNames" :value="columnName">{{columnName}}</option>
  </select>
</template>
<script>
export default {
  name: 'tableheaderkeys',
  props: ['activeNames', 'getSelectedKeys', 'pushSelectedKeys'],
  data() {
    return {
      // selectedKeys: []
    }
  },
  computed: {
    selectedKeys: {
      get() {
        return this.getSelectedKeys
      },
      set: function(value) {
        this.pushSelectedKeys(value)
      }
    }
    // chooseSelectedKeys() {
    //   return this.getSelectedKeys
    // }
  },
  methods: {
    // setSelectedKeys: function(value) {
    //   this.pushSelectedKeys(value)
    // }
  }
}
</script>
