<template>
<form class="navbar-form form-horizontal" id="tableProperties">
  <div class="form-group-sm row container-fluid">
    <div v-for="(formprop, index) in formprops" :key="index">
      <label :style="{paddingLeft: '0'}" class="control-label col-sm-4" :for="formprop.label">{{formprop.label}}:</label>
      <input type="text" class="form-control input-sm col-sm-8" :id="formprop.label" />
    </div>
  </div>
</form>
</template>
<script>
import {
  mapMutations,
  mapState,
  mapGetters
} from 'vuex'
import ColumnToolTip from '../mixins/ColumnTooltip'
export default {
  name: 'sidenav',
  mixins: [ColumnToolTip],
  data() {
    return {}
  },
  mounted: function() {}
}
</script>
