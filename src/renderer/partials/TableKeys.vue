<template>
  <div>
    <div class="input-group">
      <label
        v-tooltip.left="tooltip(tooltipId)"
        class="control-label"
      >{{ labelName }}</label>
      <component
        :is="tooltipView"
        :index="index"
      />
      <select
        :value="getSelectedTable()"
        class="form-control input-sm"
        @input="setSelectedTable($event.target.value)"
      >
        <option
          v-for="tableName in allTables"
          :id="tableName"
          :key="tableName"
          :value="tableName"
        >
          {{ tableName }}
        </option>
      </select>
    </div>
  </div>
</template>
<script>
import ForeignKeysTooltip from '../mixins/ForeignKeysTooltip'
export default {
  name: 'Tablekeys',
  mixins: [ForeignKeysTooltip],
  props: {
    allTableNames: {
      type: Array,
      default: function () { return [] }
    },
    getSelectedTable: {
      type: Function,
      default: function () { return [] }
    },
    pushSelectedTable: {
      type: Function,
      default: function () {}
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
    }
  },
  computed: {
    allTables () {
      return this.allTableNames || []
    }
  },
  methods: {
    setSelectedTable (value) {
      this.pushSelectedTable(value)
    }
  }
}
</script>
<style lang="styl" scoped>
@import '~static/css/foreignkeyheaders'
</style>
