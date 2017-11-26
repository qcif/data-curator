<template>
  <div id="foreignKeyFields">
    <component v-show="enableLocalHeaders" is="tableheaderkeys" :activeNames="activeLocalNames" :selectedKeys="selectedLocalKeys"/>
    <component v-show="enableForeignTable" is="tablekeys" :activeTableNames="activeTableNames" :selectedTableKeys="selectedTableKeys"/>
    <component v-show="enableForeignHeaders" is="tableheaderkeys" :activeNames="activeForeignNames" :selectedKeys="selectedForeignKeys"/>
  </div>
</template>
<script>
import tablekeys from '../partials/TableKeys'
import tableheaderkeys from '../partials/TableHeaderKeys'
import RelationKeys from '../mixins/RelationKeys'
export default {
  components: {
    tablekeys,
    tableheaderkeys
  },
  mixins: [RelationKeys],
  name: 'foreignkeys',
  props: ['setProperty', 'getPropertyGivenHotId', 'propertyName'],
  data() {
    return {
      enableLocalHeaders: true,
      enableForeignTable: true,
      enableForeignHeaders: true,
      selectedLocalKeys: [],
      activeLocalNames: [],
      selectedTableKeys: [],
      activeTableNames: [],
      selectedForeignKeys: [],
      activeForeignNames: []
    }
  },
  watch: {
    selectedLocalKeys: function(values) {
      this.enableForeignTable = (values && values.length > 0)
      // this.setProperty(this.propertyName, values)
    }
  },
  methods: {
    updateSubscriptions: function(names, hotId) {
      this.updateActiveLocalNames(names)
      // this.updateSelectedLocalKeys(hotId)
      // this.updateActiveTableNames(names)
      // this.updateSelectedTableKeys(hotId)
      // this.updateActiveForeignNames(names)
      // this.updateSelectedForeignKeys(hotId)
    },
    updateActiveLocalNames: function(names) {
      this.activeLocalNames = _.without(names, '')
    },
    updateSelectedTableKeys: function(hotId) {
      this.selectedKeys = this.getPropertyGivenHotId(this.propertyName, hotId) || []
    },
    updateActiveTableNames: function(names) {
      this.activeNames = _.without(names, '')
    },
    updateSelectedLocalKeys: function(hotId) {
      this.selectedKeys = this.getPropertyGivenHotId(this.propertyName, hotId) || []
    },
    updateActiveForeignlNames: function(names) {
      this.activeNames = _.without(names, '')
    },
    updateSelectedForeignKeys: function(hotId) {
      this.selectedKeys = this.getPropertyGivenHotId(this.propertyName, hotId) || []
    }
  }
}
</script>
<style lang="styl" scoped>
@import '~static/css/foreignkeys'
</style>
