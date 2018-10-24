<template>
  <div id="primaryKeys">
    <component
      is="tableheaderkeys"
      :active-names="localHeaderNames"
      :get-selected-keys="getSelectedKeys"
      :push-selected-keys="pushSelectedKeys"/>
  </div>
</template>
<script>
import tableheaderkeys from '../partials/TableHeaderKeys'
import RelationKeys from '../mixins/RelationKeys'
export default {
  name: 'Primarykeys',
  components: {
    tableheaderkeys
  },
  mixins: [RelationKeys],
  props: ['setProperty', 'getPropertyGivenHotId', 'propertyName', 'currentHotId'],
  data() {
    return {
      localHeaderNames: [],
      selectedLocalKeys: []
    }
  },
  computed: {
    getSelectedKeys() {
      return this.selectedLocalKeys
    }
  },
  methods: {
    updateSubscriptions: async function(allTablesAllColumns, hotId) {
      let localHotId = await this.currentHotId()
      this.localHeaderNames.length = 0
      this.localHeaderNames.push(...this.getHotIdHeaderNames(allTablesAllColumns, localHotId))
      this.selectedLocalKeys.length = 0
      let values = this.getPropertyGivenHotId(this.propertyName, localHotId) || []
      this.selectedLocalKeys.push(...values)
    },

    pushSelectedKeys: function(values) {
      this.setProperty(this.propertyName, values)
    }
  }
}
</script>
