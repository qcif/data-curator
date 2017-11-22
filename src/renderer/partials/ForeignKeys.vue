<template>
  <div id="foreignKeyFields">
    <component v-for="keyType in ['tablekeys', 'tableheaderkeys']" :key="keyType" :is="keyType" :waitForHotIdFromTabId="waitForHotIdFromTabId" :propertyName="propertyName" :getProperty="getProperty" :getPropertyGivenHotId="getPropertyGivenHotId" :setProperty="setProperty"/>
  </div>
</template>
<script>
import tablekeys from '../partials/TableKeys'
import tableheaderkeys from '../partials/TableHeaderKeys'
export default {
  components: {
    tablekeys,
    tableheaderkeys
  },
  name: 'foreignkeys',
  props: ['waitForHotIdFromTabId', 'setProperty', 'getProperty', 'getPropertyGivenHotId', 'propertyName'],
  watch: {
    selectedKeys: function(values) {
      console.log('keys selected...')
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
<style lang="styl" scoped>
@import '~static/css/foreignkeys'
</style>
