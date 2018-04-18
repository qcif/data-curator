<template>
<form class="navbar-form form-horizontal" id="sidenavProperties">
  <div class="form-group-sm row container-fluid">
    <div v-for="(formprop, index) in formprops" :key="index">
      <label class="control-label col-sm-3" :for="formprop.label">{{formprop.label}}</label>
      <input type="text" class="form-control input-sm col-sm-9" :id="formprop.key" />
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
  props: ['sideNavFormHeight', 'adjustSidenavFormHeight'],
  mixins: [ColumnToolTip],
  data() {
    return {
      formprops: [],
      activeCurrentHotId: null
    }
  },
  computed: {
    ...mapGetters(['getActiveTab', 'getHotIdFromTabId'])
  },
  methods: {
    isSharedComponent: function(key) {
      let isShared = ['sources', 'licenses', 'primaryKeys', 'foreignKeys', 'contributors'].indexOf(key) !== -1
      return isShared
    },
    propertyGetObjectGivenHotId: function(key, hotId) {
      return {
        'hotId': hotId,
        'key': key
      }
    },
    currentHotId: async function() {
      let hotId
      let hot = HotRegister.getActiveInstance()
      if (hot) {
        hotId = hot.guid
      } else {
        try {
        // wait for hotid if new tab opened
          hotId = await this.getHotIdFromTabId(this.getActiveTab)
        } catch (err) {
          if (err) {
            console.log('ERROR: Could not get hot id.', err)
          }
        }
      }
      // enable faster access for setters
      this.activeCurrentHotId = hotId
      return hotId
    },
    propertyGetObject: function(key) {
      const hotId = HotRegister.getActiveInstance().guid
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
          console.log(err)
        }
      }
    },
    syncSidenavFormHeight: function() {
      let sidenav = document.querySelector('#sidenav')
      let form = sidenav.querySelector('form')
      form.style.height = this.sideNavFormHeight
    },
    // convenience method for inside functions
    getCurrentHotId: function() {
      return this.activeCurrentHotId
    }
  },
  mounted: function() {
    this.syncSidenavFormHeight()
  },
  beforeCreate: function() {
    this.$nextTick(function() {
      // set hidden inputs
      let found = this.formprops.forEach(x => {
        if (x.type ==='hidden') {
          this.setProperty(x.key, x.value)
        }
      })
    })
  },
  watch: {
    sideNavFormHeight: function() {
      this.adjustSidenavFormHeight()
    }
  }
}
</script>
