<template>
  <form
    id="sidenavProperties"
    class="navbar-form form-horizontal"
  >
    <div class="form-group-sm row container-fluid">
      <div
        v-for="(formprop, index) in formprops"
        :key="index"
      >
        <label
          :for="formprop.label"
          class="control-label col-sm-3"
        >{{ formprop.label }}</label>
        <input
          :id="formprop.key"
          type="text"
          class="form-control input-sm col-sm-9"
        >
      </div>
    </div>
  </form>
</template>
<script>
import {
  mapGetters
} from 'vuex'
import {
  HotRegister
} from '../hot.js'
import ColumnToolTip from '../mixins/ColumnTooltip'
export default {
  name: 'Sidenav',
  mixins: [ColumnToolTip],
  props: {
    sideNavFormHeight: {
      type: String,
      default: ''
    },
    adjustSidenavFormHeight: {
      type: Function,
      default: function () {}
    }
  },
  data () {
    return {
      formprops: [],
      activeCurrentHotId: null
    }
  },
  computed: {
    ...mapGetters(['getActiveTab', 'getHotIdFromTabId'])
  },
  watch: {
    sideNavFormHeight: function () {
      this.adjustSidenavFormHeight()
    }
  },
  mounted: function () {
    this.syncSidenavFormHeight()
  },
  beforeCreate: function () {
    this.$nextTick(function () {
      // set hidden inputs
      this.formprops.forEach(x => {
        if (x.type === 'hidden') {
          this.setProperty(x.key, x.value)
        }
      })
    })
  },
  methods: {
    isSharedComponent: function (key) {
      return ['sources', 'licenses', 'primaryKeys', 'foreignKeys', 'contributors', 'customs'].indexOf(key) !== -1
    },
    propertyGetObjectGivenHotId: function (key, hotId) {
      return {
        'hotId': hotId,
        'key': key
      }
    },
    currentHotId: async function () {
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
            console.error('ERROR: Could not get hot id.', err)
          }
        }
      }
      // enable faster access for setters
      this.activeCurrentHotId = hotId
      return hotId
    },
    propertyGetObject: function (key) {
      const hotId = HotRegister.getActiveInstance().guid
      return {
        'hotId': hotId,
        'key': key
      }
    },
    propertySetObject: function (key, value) {
      const hotId = HotRegister.getActiveInstance().guid
      console.log(`${hotId}: ${key}: ${value}`)
      return {
        'hotId': hotId,
        'key': key,
        'value': value
      }
    },
    // convenience method
    waitForHotIdFromTabId: async function (tabId) {
      try {
        let hotId = await this.getHotIdFromTabId(tabId)
        return hotId
      } catch (err) {
        if (err) {
          console.error(err)
        }
      }
    },
    syncSidenavFormHeight: function () {
      let sidenav = document.querySelector('#sidenav')
      let form = sidenav.querySelector('form')
      form.style.height = this.sideNavFormHeight
    },
    // convenience method for inside functions
    getCurrentHotId: function () {
      return this.activeCurrentHotId
    }
  }
}
</script>
