<template>
<form class="navbar-form form-horizontal" id="tableProperties">
  <div class="form-group-sm row container-fluid">
    <div v-for="(formprop, index) in formprops" :key="index">
      <label class="control-label col-sm-3" :for="formprop.label">{{formprop.label}}:</label>
      <input type="text" class="form-control input-sm col-sm-9" :id="formprop.label" />
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
import {
  HotRegister
} from '../hot.js'
import ColumnToolTip from '../mixins/ColumnTooltip'
export default {
  name: 'sidenav',
  mixins: [ColumnToolTip],
  data() {
    return {
      formprops: []
    }
  },
  computed: {
    ...mapGetters(['getActiveTab', 'getHotIdFromTabId'])
  },
  methods: {
    isSharedComponent: function(label) {
      let isShared = ['sources', 'licenses'].indexOf(label) !== -1
      return isShared
    },
    propertyGetObjectGivenHotId: function(key, hotId) {
      return {
        'hotId': hotId,
        'key': key
      }
    },
    propertyGetObject: function(key) {
      const hotId = HotRegister.getActiveInstance().guid
      console.log(`hotid is ${hotId}`)
      return {
        'hotId': hotId,
        'key': key
      }
    },
    propertySetObject: function(key, value) {
      const hotId = HotRegister.getActiveInstance().guid
      return {
        'hotId': hotId,
        'key': key,
        'value': value
      }
    },
    // convenience method
    waitForHotIdFromTabId: async function(tabId) {
      try {
        let hotId = await this.getHotIdFromTabId(tabId)
        return hotId
      } catch (err) {
        if (err) {
          console.log('Problem with promise of hot id')
          console.log(err)
        }
      }
    }
  },
  mounted: function() {},
  beforeCreate: function() {
    this.$nextTick(function() {
      // set hidden inputs
      let found = this.formprops.forEach(x => {
        if (x.type ==='hidden') {
          this.setProperty(x.label, x.value)
        }
      })
    })
  }
}
</script>
<style lang="styl" scoped>
@import '~static/css/sidenavprops'
</style>
