<template>
  <div id="primaryKeys">
    <component is="tableheaderkeys" :activeNames="activeNames" :getSelectedKeys="getSelectedKeys" :pushSelectedKeys="pushSelectedKeys"/>
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
  props: ['setProperty', 'getPropertyGivenHotId', 'propertyName', 'currentHotId'],
  data() {
    return {
      activeNames: [],
      hotId: false
    }
  },
  methods: {
    updateSubscriptions: function(names, hotId) {
      console.log('updated primary key subscriptions')
      this.updateActiveNames(names)
      this.hotId = hotId
      let values = this.getPropertyGivenHotId(this.propertyName, hotId)
      this.pushSelectedKeys(values)
    },
    updateActiveNames: function(names) {
      this.activeNames = _.without(names, '')
    },
    getSelectedKeys: function() {
      console.log('before in primary keys')
      console.log(`hot id is ${this.hotId}`)
      if (this.hotId) {
        return this.getPropertyGivenHotId(this.propertyName, this.hotId) || []
      } else {
        return []
      }
    },
    pushSelectedKeys: function(values) {
      console.log(`property name before push is ${this.propertyName}`)
      console.log(values)
      this.setProperty(this.propertyName, values)
    }
  }
}
</script>
