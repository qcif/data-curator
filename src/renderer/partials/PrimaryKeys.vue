<template>
<div>
  <div id="primaryKeys">
    <component is="tablekeys" :waitForHotIdFromTabId="waitForHotIdFromTabId" :propertyName="propertyName" :getProperty="getProperty" :getPropertyGivenHotId="getPropertyGivenHotId" :setProperty="setProperty"/>
  </div>
</div>
</template>
<script>
import tablekeys from '../partials/TableKeys'
export default {
  components: {
    tablekeys
  },
  name: 'primarykeys',
  props: ['waitForHotIdFromTabId', 'setProperty', 'getProperty', 'getPropertyGivenHotId', 'propertyName']
}
</script>
