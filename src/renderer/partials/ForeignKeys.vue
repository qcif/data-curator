<template>
  <div id="foreignKeyFields">
    <component v-show="enableLocalHeaders" is="tableheaderkeys" :activeNames="activeLocalNames" :getSelectedKeys="getSelectedLocalKeys" :pushSelectedKeys="pushSelectedLocalKeys"/>
    <!-- <component v-show="enableForeignTable" is="tablekeys" :activeTableNames="activeTableNames" :selectedTableKeys="selectedTableKeys"/>
    <component v-show="enableForeignHeaders" is="tableheaderkeys" :activeNames="activeForeignNames" :selectedKeys="selectedForeignKeys"/> -->
  </div>
</template>
<script>
import tablekeys from '../partials/TableKeys'
import tableheaderkeys from '../partials/TableHeaderKeys'
import RelationKeys from '../mixins/RelationKeys'
// import { Subscription } from 'rxjs/Subscription'
// import {getSelectedLocalKeys$} from '@/rxSubject.js'
// import VueRx from 'vue-rx'
// import Vue from 'vue'
// Vue.use(VueRx, {
//   Subscription
// })
export default {
  components: {
    tablekeys,
    tableheaderkeys
  },
  mixins: [RelationKeys],
  name: 'foreignkeys',
  props: ['setProperty', 'getPropertyGivenHotId', 'propertyName', 'currentHotId'],
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
      activeForeignNames: [],
      hotId: false
    }
  },
  computed: {
    localName() {
      return `${this.propertyName}.fields`
    },
    getSelectedLocalKeys: function() {
      console.log('before in foreign keys')
      console.log(`hot id is ${this.hotId}`)
      // this.$forceUpdate()
      return this.selectedLocalKeys || []
    }
  },
  methods: {
    updateSubscriptions: function(names, hotId) {
      this.updateActiveLocalNames(names)
      this.hotId = hotId
      let foreignKeyValues = this.getPropertyGivenHotId(this.propertyName, hotId) || {fields: []}
      this.selectedLocalKeys = foreignKeyValues.fields || []
      // this.updateSelectedLocalKeys(hotId)
      // this.updateActiveTableNames(names)
      // this.updateSelectedTableKeys(hotId)
      // this.updateActiveForeignNames(names)
      // this.updateSelectedForeignKeys(hotId)
    },
    updateActiveLocalNames: function(names) {
      this.activeLocalNames = _.without(names, '')
    },
    // updateSelectedTableKeys: function(hotId) {
    //   this.selectedKeys = this.getPropertyGivenHotId(this.propertyName, hotId) || []
    // },
    // updateActiveTableNames: function(names) {
    //   this.activeNames = _.without(names, '')
    // },
    // updateSelectedLocalKeys: function(hotId) {
    //   this.selectedKeys = this.getPropertyGivenHotId(this.propertyName, hotId) || []
    // },
    // updateActiveForeignlNames: function(names) {
    //   this.activeNames = _.without(names, '')
    // },
    // updateSelectedForeignKeys: function(hotId) {
    //   this.selectedKeys = this.getPropertyGivenHotId(this.propertyName, hotId) || []
    // },

    pushSelectedLocalKeys: function(values) {
      console.log(`property name before foreign key push is ${this.localName}`)
      console.log(values)
      this.setProperty(this.localName, values)
    }
  }
}
</script>
<style lang="styl" scoped>
@import '~static/css/foreignkeys'
</style>
