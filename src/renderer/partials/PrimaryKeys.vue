<template>
  <div id="primaryKeys">
    <component is="tableheaderkeys" :activeNames="localHeaderNames" :getSelectedKeys="getSelectedKeys" :pushSelectedKeys="pushSelectedKeys"/>
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
  data() {
    return {
      localHeaderNames: [],
      selectedLocalKeys: []
    }
  },
  props: ['setProperty', 'getPropertyGivenHotId', 'propertyName', 'currentHotId'],
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
