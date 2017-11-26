<template>
  <div id="primaryKeys">
    <component is="tableheaderkeys" :waitForHotIdFromTabId="waitForHotIdFromTabId" :activeNames="activeNames" :selectedKeys="selectedKeys"/>
  </div>
</template>
<script>
import tableheaderkeys from '../partials/TableHeaderKeys'
import RelationKeys from '../mixins/RelationKeys'
export default {
  components: {
    tableheaderkeys
  },
  mixins: [RelationKeys],
  name: 'primarykeys',
  props: ['waitForHotIdFromTabId', 'setProperty', 'getProperty', 'getPropertyGivenHotId', 'propertyName'],
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
