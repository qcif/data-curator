<template>
<form class="navbar-form form-horizontal" id="tableProperties">
  <div class="form-group-sm row container-fluid">
    <div v-for="(formprop, index) in formprops" :key="index">
      <label :style="{paddingLeft: '0'}" class="control-label col-sm-4" :for="formprop.label">{{formprop.label}}:</label>
      <!-- until all labels have input only setup get/set for explicity set type-->
      <input v-if="formprop.type === 'text'" v-model="missingValues" type="text" class="form-control input-sm col-sm-8" :id="formprop.label" />
      <input v-else type="text" class="form-control input-sm col-sm-8" :id="formprop.label" />
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
import {
  HotRegister
} from '../hot.js'
export default {
  name: 'sidenav',
  mixins: [ColumnToolTip],
  data() {
    return {
    }
  },
  computed: {
    ...mapGetters(['getMissingValues']),
    missingValues: {
      get: function() {
        let hot = HotRegister.getActiveInstance()
        if (hot) {
          let array = this.getMissingValues(hot.guid) || ['']
          let string = array.join()
          console.log(`string is: *${string}*`)
          return string
        }
      },
      set: function(value) {
        let hot = HotRegister.getActiveInstance()
        if (hot) {
          let array = value.split(',')
          console.log('setting missing')
          console.log(array)
          this.pushMissingValues({hotId: hot.guid, missingValues: array})
        }
      }
    }
  },
  methods: {
    ...mapMutations([
      'pushMissingValues'])
  },
  mounted: function() {
  }
}
</script>
