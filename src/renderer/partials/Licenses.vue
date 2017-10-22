<template>
<div>
  <div id="licenses">
    <label class="control-label col-sm-4" />
    <select v-model="selectedLicenses" class="form-control input-sm col-sm-8" multiple>
        <option v-for="license in licenses" :value="license.id">{{license.id}}</option>
      </select>
  </div>
</div>
</template>
<script>
import {
  mapGetters
} from 'vuex'
export default {
  name: 'licenses',
  props: ['getPropertyGivenHotId', 'setProperty', 'waitForHotIdFromTabId'],
  data() {
    return {
      licenses: [{
        'id': 'CC-BY-4.0',
        'title': 'Creative Commons Attribution 4.0',
        'url': 'https://creativecommons.org/licenses/by/4.0/'
      },
      {
        'id': 'CC-BY-SA-4.0',
        'title': 'Creative Commons Attribution Share-Alike 4.0',
        'url': 'https://creativecommons.org/licenses/by-sa/4.0/'
      },
      {
        'id': 'CC0-1.0',
        'title': 'Creative Commons CCZero',
        'url': 'https://creativecommons.org/publicdomain/zero/1.0/'
      },
      {
        'id': 'ODC-BY-1.0',
        'title': 'Open Data Commons Attribution License 1.0',
        'url': 'http://www.opendefinition.org/licenses/odc-by'
      },
      {
        'id': 'ODbL-1.0',
        'title': 'Open Data Commons Open Database License 1.0',
        'url': 'http://www.opendefinition.org/licenses/odc-odbl'
      },
      {
        'id': 'ODC-PDDL-1.0',
        'title': 'Open Data Commons Public Domain Dedication and Licence 1.0',
        'url': 'http://www.opendefinition.org/licenses/odc-pddl'
      },
      {
        'id': 'OGL-Canada-2.0',
        'title': 'Open Government License 2.0 (Canada)',
        'url': 'http://data.gc.ca/eng/open-government-licence-canada'
      },
      {
        'id': 'OGL-UK-3.0',
        'title': 'Open Government Licence 3.0 (United Kingdom)',
        'url': 'https://www.nationalarchives.gov.uk/doc/open-government-licence/version/3/'
      },
      {
        'id': 'OGDL-TW-1.0',
        'title': 'Open Government Data License Taiwan 1.0',
        'url': 'https://data.gov.tw/license/'
      },
      {
        'id': 'pdm',
        'title': 'Public Domain Mark',
        'url': 'http://creativecommons.org/publicdomain/mark/1.0/'
      },
      {
        'id': 'other-pd',
        'title': 'Other (Public Domain)',
        'url': ''
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
      let licenseIds = await this.getLicenseIdsFromTab()
      this.selectedLicenses = licenseIds
    },
    getLicenseIdsFromTab: async function() {
      let licenses = await this.getLicensesFromTab()
      let licenseIds = licenses ? licenses.map(x => {
        return x.id
      }) : []
      return licenseIds
    },
    getLicensesFromTab: async function() {
      let tab = this.getActiveTab
      let hotId = await this.waitForHotIdFromTabId(tab)
      let licenses = this.getPropertyGivenHotId('licenses', hotId)
      return licenses
    },
    licensesObject: function(ids) {
      if (ids && ids.length > 0) {
        return this.licenses.filter(x => ids.indexOf(x.id) !== -1)
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
