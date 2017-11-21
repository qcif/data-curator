<template>
<div>
  <div id="primaryKeys">
    <component is="tableheaderkeys" :waitForHotIdFromTabId="waitForHotIdFromTabId" :propertyName="propertyName" :getProperty="getProperty" :getPropertyGivenHotId="getPropertyGivenHotId" :setProperty="setProperty"/>
  </div>
</div>
</template>
<script>
import tableheaderkeys from '../partials/TableHeaderKeys'
export default {
  components: {
    tableheaderkeys
  },
  name: 'primarykeys',
  props: ['waitForHotIdFromTabId', 'setProperty', 'getProperty', 'getPropertyGivenHotId', 'propertyName']
}
</script>
