<template>
<form class="navbar-form form-horizontal" id="packageProperties">
  <div class="form-group-sm row container-fluid">
    <div class="propertyrow" v-for="(formprop, index) in formprops" :key="index">
      <template v-if="formprop.type !== 'hidden'">
        <label class="control-label col-sm-3" :for="formprop.label">{{formprop.label}}:</label>
        <component v-if="isSharedComponent(formprop.label)" :getProperty="getProperty" :getPropertyGivenHotId="getPropertyGivenHotId" :setProperty="setProperty" :waitForHotIdFromTabId="waitForHotIdFromTabId" :is="formprop.label"/>
        <input v-else type="text" class="form-control input-sm col-sm-9" :id="formprop.label" :value="getProperty(formprop.label)" @input="setProperty(formprop.label, $event.target.value)"/>
      </template>
    </div>
  </div>
</form>
</template>
<script>
import SideNav from './SideNav'
import licenses from '../partials/Licenses'
import sources from '../partials/Sources'
import {
  mapMutations,
  mapState,
  mapGetters
} from 'vuex'
export default {
  extends: SideNav,
  name: 'packager',
  components: {
    licenses,
    sources
  },
  data() {
    return {
      formprops: [{
        label: 'name',
        type: 'input'
      },
      {
        label: 'id',
        type: 'input'
      },
      {
        label: 'profile',
        type: 'hidden',
        value: 'tabular-data-package'
      },
      {
        label: 'title',
        type: 'input'
      },
      {
        label: 'description',
        type: 'markdown'
      },
        // lead user through with http://specs.frictionlessdata.io/patterns/#data-package-version
      {
        label: 'version',
        type: 'input'
      },
      {
        label: 'sources',
        type: 'dropdown'
      },
      {
        label: 'licenses'
      }
      ]
    }
  },
  computed: {
    ...mapGetters(['getPackageProperty'])
  },
  methods: {
    ...mapMutations([
      'pushPackageProperty'
    ]),
    getProperty: function(key) {
      return this.getPackageProperty({
        'key': key
      })
    },
    getPropertyGivenHotId: function(key, hotId) {
      console.log(`key is ${key}`)
      return this.getProperty(key)
    },
    setProperty: function(key, value) {
      this.pushPackageProperty({key: key, value: value})
    }
  },
  beforeCreate: function() {
    this.$nextTick(function() {
      // set hidden inputs
      let found = this.formprops.forEach(x => {
        if (x.type ==='hidden') {
          this.setProperty(x.label, x.value)
        }
      })
    })
  },
  watch: {
  }
}
</script>
