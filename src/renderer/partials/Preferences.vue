<template>
  <form class="navbar-form form-horizontal" id="preferenceProperties">
    <div class="form-group-sm row container-fluid">
      <div class="propertyrow" v-for="(formprop, index) in formprops" :key="index">
        <label v-tooltip.left="tooltip(formprop.tooltipId)" class="control-label col-sm-3"
               :for="formprop.label">{{formprop.label}}</label>
        <component :is="formprop.tooltipView"/>
        <component v-if="isSharedComponent(formprop.key)" :propertyName="formprop.key"
                   :getProperty="getProperty" :getPropertyGivenHotId="getPropertyGivenHotId"
                   :setProperty="setProperty" :waitForHotIdFromTabId="waitForHotIdFromTabId"
                   :currentHotId="currentHotId" :is="formprop.key" :contributorsSetter="contributorsSetter"/>
        <div v-else-if="isProxyLabel(formprop.label)" id="proxy-preferences" class="inputs-container">
          <div v-show="isProxyVisible" class="input-group" v-for="(attribute, index) in formprop.attributes">
            <span class="input-group-addon input-sm col-sm-4">{{upperCase(attribute)}}</span>
            <input type="text" :class="{ 'form-control input-sm col-sm-8': true }"
                   :id="proxyKey(attribute)" :value="getProperty(proxyKey(attribute))" @input="setProperty(proxyKey(attribute), $event.target.value)"/>
          </div>
          <div class="button-container">
            <button type="button" class="toggle-proxy btn btn-primary btn-sm" @click="isProxyVisible=!isProxyVisible">
              <span class="glyphicon glyphicon-plus"/>{{isProxyVisible ? 'Hide Proxy' : 'Show Proxy'}}
            </button>
          </div>
        </div>

        <!--<input v-else type="text" :class="{ 'form-control input-sm col-sm-9': true, 'validate-danger': errors.has(formprop.key) }" :id="formprop.key" :value="getProperty(formprop.key)" @input="setProperty(formprop.key, $event.target.value)" v-validate="validationRules(formprop.key)" :name="formprop.key"/>-->
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
  import {ipcRenderer as ipc} from 'electron'
  import {proxyAttributes, proxyKeyName} from '@/proxyProperties.js'

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
        isProxyVisible: false,
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
            label: 'Proxy',
            attributes: proxyAttributes
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
      contributorsSetter: function (index, prop, value) {
        let currentContributors = ipc.sendSync('getPreference', 'contributors')
        currentContributors[index][prop] = value
        this.setProperty('contributors', currentContributors)
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
      },
      isProxyLabel: function (label) {
        return _.lowerCase(label) === 'proxy'
      },
      upperCase: function(value) {
        return _.upperCase(value)
      },
      proxyKey: function(key) {
        return proxyKeyName(key)
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
<style lang="styl" scoped>
  @import '~static/css/preferences'
</style>
