<template>
<div>
  <!-- <input :value="collectedLicenses" @input="selectLicenseHints($event.target.value)" class="form-control input-sm col-sm-8" type="text" /> -->
  <div id="licenses">
    <!-- <label class="control-label col-sm-4" /> -->
    <select v-model="selectedLicenses" class="form-control input-sm col-sm-9" multiple>
        <option v-for="license in licenses" :value="license.title">{{license.title}}</option>
      </select>
  </div>
</div>
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
export default {
  name: 'licenses',
  props: ['getPropertyGivenHotId', 'setProperty', 'waitForHotIdFromTabId'],
  data() {
    return {
      licenses: [{
        'name': 'CC-BY-4.0',
        'title': 'Creative Commons Attribution 4.0',
        'path': 'https://creativecommons.org/licenses/by/4.0/'
      },
      {
        'name': 'CC-BY-SA-4.0',
        'title': 'Creative Commons Attribution Share-Alike 4.0',
        'path': 'https://creativecommons.org/licenses/by-sa/4.0/'
      },
      {
        'name': 'CC0-1.0',
        'title': 'Creative Commons CCZero 1.0',
        'path': 'https://creativecommons.org/publicdomain/zero/1.0/'
      },
      {
        'name': 'ODC-BY-1.0',
        'title': 'Open Data Commons Attribution License 1.0',
        'path': 'http://www.opendefinition.org/licenses/odc-by'
      },
      {
        'name': 'ODbL-1.0',
        'title': 'Open Data Commons Open Database License 1.0',
        'path': 'http://www.opendefinition.org/licenses/odc-odbl'
      },
      {
        'name': 'ODC-PDDL-1.0',
        'title': 'Open Data Commons Public Domain Dedication and Licence 1.0',
        'path': 'http://www.opendefinition.org/licenses/odc-pddl'
      },
      {
        'name': 'OGL-Canada-2.0',
        'title': 'Open Government License 2.0 (Canada)',
        'path': 'http://data.gc.ca/eng/open-government-licence-canada'
      },
      {
        'name': 'OGL-UK-3.0',
        'title': 'Open Government Licence 3.0 (United Kingdom)',
        'path': 'https://www.nationalarchives.gov.uk/doc/open-government-licence/version/3/'
      },
      {
        'name': 'OGDL-TW-1.0',
        'title': 'Open Government Data License Taiwan 1.0',
        'path': 'https://data.gov.tw/license/'
      },
      {
        'title': 'Public Domain Mark',
        'path': 'http://creativecommons.org/publicdomain/mark/1.0/'
      }],
      selectedLicenses: []
    }
  },
  watch: {
    getActiveTab: function() {
      // update licenses when adding tabs
      this.initLicenses()
    },
    selectedLicenses: function(selected) {
      this.setProperty('licenses', this.licensesObject(selected))
    }
  },
  computed: {
    ...mapGetters(['getActiveTab'])
  },
  methods: {
    initLicenses: async function() {
      let licenseTitles = await this.getLicenseTitlesFromTab()
      this.selectedLicenses = licenseTitles
    },
    getLicenseTitlesFromTab: async function() {
      let licenses = await this.getLicensesFromTab()
      let licenseTitles = licenses ? licenses.map(x => {
        return x.title
      }) : []
      return licenseTitles
    },
    getLicensesFromTab: async function() {
      let tab = this.getActiveTab
      let hotId = await this.waitForHotIdFromTabId(tab)
      let licenses = this.getPropertyGivenHotId('licenses', hotId)
      return licenses
    },
    licensesObject: function(ids) {
      if (ids && ids.length > 0) {
        return this.licenses.filter(x => ids.indexOf(x.title) !== -1)
      } else {
        return []
      }
    }
  },
  mounted: function() {
    // update license when re-opening panel with licenses
    this.initLicenses()
  }
}
</script>
<style lang="styl" scoped>
@import '~static/css/licenses'
</style>
