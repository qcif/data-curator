<template>
  <div>
    <div class="input-group">
      <label v-show="labelName" class="control-label" v-tooltip.left="tooltip(tooltipId)">{{labelName}}</label>
      <select v-model="selectedKeys" class="form-control input-sm" multiple>
        <option v-for="columnName in activeNames" :value="columnName">{{columnName}}</option>
      </select>
    </div>
    <component :is="tooltipView"/>
  </div>
</template>
<script>
import ForeignKeysTooltip from '../mixins/ForeignKeysTooltip'
export default {
  name: 'tableheaderkeys',
  mixins: [ForeignKeysTooltip],
  props: ['activeNames', 'getSelectedKeys', 'pushSelectedKeys', 'labelName', 'tooltipId', 'tooltipView'],
  data() {
    return {
      // selectedKeys: []
    }
  },
  computed: {
    selectedKeys: {
      get() {
        return this.getSelectedKeys
      },
      set: function(value) {
        console.log('about to send value:')
        console.log(value)
        this.pushSelectedKeys(value)
      }
    }
    // chooseSelectedKeys() {
    //   return this.getSelectedKeys
    // }
  },
  methods: {
    // setSelectedKeys: function(value) {
    //   this.pushSelectedKeys(value)
    // }
  }
}
</script>
<style lang="styl" scoped>
@import '~static/css/foreignkeyheaders'
</style>
