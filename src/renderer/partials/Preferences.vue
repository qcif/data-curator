<template>
  <form class="navbar-form form-horizontal" id="preferenceProperties">
    <div class="form-group-sm row container-fluid">
      <div class="propertyrow" v-for="(formprop, index) in formprops" :key="index">
        <label v-tooltip.left="tooltip(formprop.tooltipId)" class="control-label col-sm-3" :for="formprop.label">{{formprop.label}}</label>
        <component :is="formprop.tooltipView"/>
        <component v-if="isSharedComponent(formprop.key)" :propertyName="formprop.key" :getProperty="getProperty" :getPropertyGivenHotId="getPropertyGivenHotId" :setProperty="setProperty" :waitForHotIdFromTabId="waitForHotIdFromTabId" :currentHotId="currentHotId" :is="formprop.key"/>
        <div v-show="errors.has(formprop.key) && removeProperty(formprop.key)" class="row help validate-danger">
          {{ errors.first(formprop.key)}}
        </div>
      </div>
    </div>
  </form>
</template>
<script>
import SideNav from '@/partials/SideNav'
import licenses from '@/partials/Licenses'
import contributors from '@/partials/Contributors'
import PreferencesTooltip from '@/mixins/PreferencesTooltip'
import ValidationRules from '@/mixins/ValidationRules'
import {
  mapMutations,
  mapState,
  mapGetters
} from 'vuex'
export default {
  extends: SideNav,
  name: 'preferences',
  mixins: [ValidationRules, PreferencesTooltip],
  components: {
    licenses,
    contributors
  },
  data() {
    return {
      formprops: [{
        label: 'License(s)',
        key: 'licenses',
        tooltipId: 'tooltip-preferences-licenses',
        tooltipView: 'tooltipPreferencesLicenses'
      },
      {
        label: 'Contributor(s)',
        key: 'contributors',
        tooltipId: 'tooltip-preferences-contributors',
        tooltipView: 'tooltipPreferencesContributors'
      }]
    }
  },
  methods: {
    getProperty: function(key) {
      // return this.getPackageProperty({
      //   'key': key
      // })
    },
    getPropertyGivenHotId: function(key, hotId) {
      return this.getProperty(key)
    },
    setProperty: function(key, value) {
      // this.pushPackageProperty({
      //   key: key,
      //   value: value
      // })
    },
    removeProperty: function(key) {
      let value = ''
      this.setProperty(key, value)
      return true
    }
  },
  created: function() {
    // this.$on('guessProperties', function() {
    //   this.updateColumnProperties()
    // })
  }
}
</script>
<style lang="styl" scoped>
@import '~static/css/validationrules'
</style>
<style lang="styl" scoped>
@import '~static/css/sidenav'
</style>
