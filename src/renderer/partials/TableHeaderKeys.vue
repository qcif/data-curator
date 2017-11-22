<template>
  <select v-model="selectedKeys" class="form-control input-sm col-sm-9" multiple>
    <option v-for="columnName in activeNames" :value="columnName">{{columnName}}</option>
  </select>
</template>
<script>
import RelationKeys from '../mixins/RelationKeys'
export default {
  name: 'tableheaderkeys',
  mixins: [RelationKeys],
  data() {
    return {
      selectedKeys: [],
      activeNames: []
    }
  },
  watch: {
    selectedKeys: function(values) {
      this.setProperty(this.propertyName, values)
    }
  },
  methods: {
    updateSubscriptions: function(names, hotId) {
      this.updateActiveNames(names)
      this.updateSelectedKeys(hotId)
    },
    updateActiveNames: function(names) {
      this.activeNames = _.without(names, '')
    },
    updateSelectedKeys: function(hotId) {
      this.selectedKeys = this.getPropertyGivenHotId(this.propertyName, hotId) || []
    }
  }

}
</script>
