<template>
  <form
    id="packageProperties"
    class="navbar-form form-horizontal"
  >
    <div class="form-group-sm row container-fluid">
      <div
        v-for="(formprop, index) in formprops"
        :key="index"
        class="propertyrow"
      >
        <label
          v-if="formprop.label"
          v-tooltip.left="tooltip(formprop.tooltipId)"
          :for="formprop.label"
          class="control-label col-sm-3"
        >{{ formprop.label }}</label>
        <component :is="formprop.tooltipView" />
        <component
          :is="formprop.key"
          v-if="isSharedComponent(formprop.key)"
          :propertyName="formprop.key"
          :getProperty="getProperty"
          :getPropertyGivenHotId="getPropertyGivenHotId"
          :setProperty="setProperty"
          :waitForHotIdFromTabId="waitForHotIdFromTabId"
          :currentHotId="currentHotId"
        />
        <!-- <input v-else type="text" class="form-control input-sm col-sm-9" :id="formprop.key" :value="getProperty(formprop.key)" @input="setProperty(formprop.key, $event.target.value)"/> -->
        <textarea
          v-else-if="formprop.key === 'description'"
          :id="formprop.key"
          :value="getProperty(formprop.key)"
          rows="4"
          class="form-control label-sm col-sm-9"
          @input="setProperty(formprop.key, $event.target.value)"
        />
        <input
          v-else
          :id="formprop.key"
          v-validate="validationRules(formprop.key)"
          :class="{ 'form-control input-sm col-sm-9': true, 'validate-danger': errors.has(formprop.key) }"
          :value="getProperty(formprop.key)"
          :name="formprop.key"
          type="text"
          @input="setProperty(formprop.key, $event.target.value)"
        >
        <div
          v-show="errors.has(formprop.key) && removeProperty(formprop.key)"
          class="row help validate-danger"
        >
          {{ errors.first(formprop.key) }}
        </div>
      </div>
    </div>
  </form>
</template>
<script>
import SideNav from '@/partials/SideNav'
import licenses from '@/partials/Licenses'
import sources from '@/partials/Sources'
import contributors from '@/partials/Contributors'
import customs from '@/partials/Customs'
import PackageTooltip from '@/mixins/PackageTooltip'
import ValidationRules from '@/mixins/ValidationRules'
import { ipcRenderer as ipc } from 'electron'
import {
  mapMutations,
  mapGetters
} from 'vuex'
import autosize from 'autosize'
import PreferenceProperty from '../mixins/PreferenceProperty'
export default {
  name: 'Packager',
  components: {
    licenses,
    sources,
    contributors,
    customs
  },
  extends: SideNav,
  mixins: [ValidationRules, PackageTooltip, PreferenceProperty],
  data () {
    return {
      formprops: [{
        label: 'Name*',
        key: 'name',
        tooltipId: 'tooltip-package-name',
        tooltipView: 'tooltipPackageName'
      },
      {
        label: 'Id',
        key: 'id',
        tooltipId: 'tooltip-package-id',
        tooltipView: 'tooltipPackageId'
      },
      {
        label: 'Title',
        key: 'title',
        tooltipId: 'tooltip-package-title',
        tooltipView: 'tooltipPackageTitle'
      },
      {
        label: 'Description',
        key: 'description',
        tooltipId: 'tooltip-package-description',
        tooltipView: 'tooltipPackageDescription'
      },
      // lead user through with http://frictionlessdata.io/specs/patterns/#data-package-version
      {
        label: 'Version',
        key: 'version',
        tooltipId: 'tooltip-package-version',
        tooltipView: 'tooltipPackageVersion'
      },
      {
        label: 'Source(s)',
        key: 'sources',
        tooltipId: 'tooltip-package-sources',
        tooltipView: 'tooltipPackageSources'
      },
      {
        label: 'License(s)',
        key: 'licenses',
        tooltipId: 'tooltip-package-licenses',
        tooltipView: 'tooltipPackageLicenses'
      },
      {
        label: 'Contributor(s)',
        key: 'contributors',
        tooltipId: 'tooltip-package-contributors',
        tooltipView: 'tooltipPackageContributors'
      },
      {
        label: 'Custom Properties',
        key: 'customs'
      }]
    }
  },
  computed: {
    ...mapGetters(['getPackageProperty'])
  },
  mounted: function () {
    autosize(document.querySelector('textarea'))
  },
  methods: {
    ...mapMutations([
      'pushPackageProperty'
    ]),
    getProperty: function (key) {
      let packageProperty = this.getPackageProperty({
        'key': key
      })
      if (typeof packageProperty === 'undefined') {
        packageProperty = this.setPreferencesAsDefault(key, this.setProperty)
      }
      return packageProperty
    },
    getPropertyGivenHotId: function (key, hotId) {
      return this.getProperty(key)
    },
    setProperty: function (key, value) {
      this.pushPackageProperty({
        key: key,
        value: value
      })
    },
    removeProperty: function (key) {
      let value = ''
      this.setProperty(key, value)
      return true
    }
  }
}
</script>
<style lang="styl" scoped>
@import '~static/css/validationrules'
</style>
<style lang="styl" scoped>
@import '~static/css/sidenav'
</style>
