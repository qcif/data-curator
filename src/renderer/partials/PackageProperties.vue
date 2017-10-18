<template>
<form class="navbar-form form-horizontal" id="packageProperties">
  <div class="form-group-sm row container-fluid">
    <div class="propertyrow" v-for="(formprop, index) in formprops" :key="index">
      <template v-if="formprop.type !== 'hidden'">
        <label class="control-label col-sm-4" :for="formprop.label">{{formprop.label}}:</label>
        <template v-if="formprop.label==='licenses'">
          <!-- <component is="licenses"></component> -->
        </template>
        <input v-else type="text" class="form-control input-sm col-sm-8" :id="formprop.label" :value="getProperty(formprop.label)" @input="setProperty(formprop.label, $event.target.value)"/>
      </template>
    </div>
  </div>
</form>
</template>
<script>
import SideNav from './SideNav'
import licenses from '../partials/Licenses'
import {
  mapMutations,
  mapState,
  mapGetters
} from 'vuex'
export default {
  extends: SideNav,
  name: 'packager',
  components: {
    licenses
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
        label: 'licenses',
        type: 'json'
      },
      {
        label: 'profile',
        type: 'hidden',
        value: 'tabular-data-package'
      },
      {
        label: 'profile'
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
        type: 'json'
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
      return this.getPackageProperty(this.propertyGetObject(key))
    },
    setProperty: function(key, value) {
      this.pushPackageProperty(this.propertySetObject(key, value))
    }
  }
}
</script>
<style lang="styl" scoped>
@import '~static/css/packageprops'
</style>
