<template>
  <div>
    <div class="input-group">
      <label class="control-label" v-tooltip.left="tooltip(tooltipId)">{{labelName}}</label>
      <component :is="tooltipView"/>
      <select v-model="selectedKeys" class="form-control input-sm" multiple>
        <option v-for="columnName in activeNames" :value="columnName">{{columnName}}</option>
      </select>
    </div>
  </div>
</template>
<script>
import ForeignKeysTooltip from '../mixins/ForeignKeysTooltip'
export default {
  name: 'tableheaderkeys',
  mixins: [ForeignKeysTooltip],
  props: ['activeNames', 'getSelectedKeys', 'pushSelectedKeys', 'labelName', 'tooltipId', 'tooltipView'],
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
  }
}
</script>
<style lang="styl" scoped>
@import '~static/css/foreignkeyheaders'
</style>
