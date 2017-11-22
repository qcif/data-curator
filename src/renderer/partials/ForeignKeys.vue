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
  props: ['waitForHotIdFromTabId', 'setProperty', 'getProperty', 'getPropertyGivenHotId', 'propertyName']
}
</script>
<style lang="styl" scoped>
@import '~static/css/foreignkeys'
</style>
