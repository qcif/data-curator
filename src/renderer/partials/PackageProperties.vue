<template>
<form class="navbar-form form-horizontal" id="packageProperties">
  <div class="form-group-sm row container-fluid">
    <div class="propertyrow" v-for="(formprop, index) in formprops" :key="index">
      <label v-tooltip.left="tooltip(formprop.tooltipId)" class="control-label col-sm-3" :for="formprop.label">{{formprop.label}}{{formprop.isMandatory ? '*' : ''}}</label>
      <component :is="formprop.tooltipView"/>
      <component v-if="isSharedComponent(formprop.key)" :propertyName="formprop.key" :getProperty="getProperty" :getPropertyGivenHotId="getPropertyGivenHotId" :setProperty="setProperty" :waitForHotIdFromTabId="waitForHotIdFromTabId" :currentHotId="currentHotId" :is="formprop.key"/>
      <!-- <input v-else type="text" class="form-control input-sm col-sm-9" :id="formprop.label" :value="getProperty(formprop.label)" @input="setProperty(formprop.label, $event.target.value)"/> -->
      <input v-else type="text" class="{ 'form-control input-sm col-sm-9': true, 'validate-danger': errors.has(formprop.label) }" :id="formprop.label" :value="getProperty(formprop.label)" @input="setProperty(formprop.label, $event.target.value)" v-validate="validationRules(formprop.label)" :name="formprop.label"/>
      <div v-show="errors.has(formprop.label) && removeProperty(formprop.label)" class="row help validate-danger">
        {{ errors.first(formprop.label)}}
      </div>
    </div>
  </div>
</form>
</template>
<script>
import SideNav from './SideNav'
import licenses from '../partials/Licenses'
import sources from '../partials/Sources'
import PackageTooltip from '../mixins/PackageTooltip'
import ValidationRules from '../mixins/ValidationRules'
import {
  mapMutations,
  mapState,
  mapGetters
} from 'vuex'
export default {
  extends: SideNav,
  name: 'packager',
  mixins: [ValidationRules, PackageTooltip],
  components: {
    licenses,
    sources
  },
  data() {
    return {
      formprops: [{
        label: 'Name',
        type: 'input',
        isMandatory: true,
        tooltipId: 'tooltip-package-name',
        tooltipView: 'tooltipPackageName'
      },
      {
        label: 'Id',
        type: 'input',
        tooltipId: 'tooltip-package-id',
        tooltipView: 'tooltipPackageId'
      },
      {
        label: 'Title',
        type: 'input',
        tooltipId: 'tooltip-package-title',
        tooltipView: 'tooltipPackageTitle'
      },
      {
        label: 'Description',
        type: 'markdown',
        tooltipId: 'tooltip-package-description',
        tooltipView: 'tooltipPackageDescription'
      },
        // lead user through with http://frictionlessdata.io/specs/patterns/#data-package-version
      {
        label: 'Version',
        type: 'input',
        tooltipId: 'tooltip-package-version',
        tooltipView: 'tooltipPackageVersion'
      },
      {
        label: 'Source(s)',
        key: 'sources',
        type: 'dropdown',
        tooltipId: 'tooltip-package-sources',
        tooltipView: 'tooltipPackageSources'
      },
      {
        label: 'License(s)',
        key: 'licenses',
        tooltipId: 'tooltip-package-licenses',
        tooltipView: 'tooltipPackageLicenses'
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
      console.log(`setting property for package...`)
      console.log(`key ${key} , value: ${value}`)
      this.pushPackageProperty({
        key: key,
        value: value
      })
    },
    removeProperty: function(key) {
      let value = ''
      this.setProperty(key, value)
      return true
    }
  }
}
</script>
<style lang="styl" scoped>
@import '~static/css/packageprops'
</style>
<style lang="styl" scoped>
@import '~static/css/validationrules'
</style>
