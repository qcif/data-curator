<template>
  <form
    id="preferenceProperties"
    class="navbar-form form-horizontal"
  >
    <div class="form-group-sm row container-fluid">
      <div
        v-for="(formprop, index) in formprops"
        :key="index"
        class="propertyrow"
      >
        <label
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
          :defaultSetter="defaultSetter"
        />
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
import contributors from '@/partials/Contributors'
import customs from '@/partials/Customs'
import PreferencesTooltip from '@/mixins/PreferencesTooltip'
import ValidationRules from '@/mixins/ValidationRules'
import { ipcRenderer as ipc } from 'electron'

export default {
  name: 'Preferences',
  components: {
    licenses,
    contributors,
    customs
  },
  extends: SideNav,
  mixins: [ValidationRules, PreferencesTooltip],
  data () {
    return {
      formprops: [
        {
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
        },
        {
          label: 'Custom Properties',
          key: 'customs'
        }]
    }
  },
  methods: {
    getProperty: function (key) {
      return ipc.sendSync('getPreference', key)
    },
    getPropertyGivenHotId: function (key, hotId) {
      return this.getProperty(key)
    },
    defaultSetter: function (index, prop, value, preference) {
      let current = ipc.sendSync('getPreference', preference)
      current[index][prop] = value
      this.setProperty(preference, current)
    },
    setProperty: function (key, values) {
      if (!_.isEmpty(values)) {
        const stringified = JSON.stringify(values)
        ipc.send('setPreference', key, stringified)
      } else {
        ipc.send('removePreference', key)
      }
    },
    validateContributors: function (values) {
      return _.filter(values, function (value) {
        return value.title.trim().length > 0
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
