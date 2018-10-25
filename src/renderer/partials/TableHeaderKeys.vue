<template>
  <div>
    <div class="input-group">
      <label
        v-tooltip.left="tooltip(tooltipId)"
        class="control-label">{{ labelName }}</label>
      <component
        :is="tooltipView"
        :index="index"/>
      <select
        v-model="selectedKeys"
        class="form-control input-sm"
        multiple>
        <option
          v-for="columnName in activeNames"
          :key="columnName"
          :value="columnName">{{ columnName }}</option>
      </select>
    </div>
  </div>
</template>
<script>
import ForeignKeysTooltip from '../mixins/ForeignKeysTooltip'
export default {
  name: 'Tableheaderkeys',
  mixins: [ForeignKeysTooltip],
  props: {
    activeNames: {
      type: Array,
      default: function() { return [] }
    },
    getSelectedKeys: {
      type: Function,
      default: function() { return [] }
    },
    pushSelectedKeys: {
      type: Function,
      default: function() {}
    },
    labelName: {
      type: String,
      default: ''
    },
    tooltipId: {
      type: String,
      default: ''
    },
    tooltipView: {
      type: String,
      default: ''
    },
    index: {
      type: Number,
      default: undefined
    },
    currentHotId: {
      type: String,
      default: ''
    }
  },
  computed: {
    selectedKeys: {
      get() {
        return this.getSelectedKeys
      },
      set: function(value) {
        this.pushSelectedKeys(value)
      }
    }
  }
}
</script>
<style lang="styl" scoped>
@import '~static/css/foreignkeyheaders'
</style>
