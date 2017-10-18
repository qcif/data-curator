<template>
  <div>
    <input :value="collectedLicenses" @input="selectLicenseHints($event.target.value)" class="form-control input-sm col-sm-8" type="text" />
    <div id="license">
      <label class="control-label col-sm-4" />
      <select v-model="selectedLicenses" class="form-control input-sm col-sm-8" multiple>
        <option v-for="license in licenseHints" :value="license">{{license}}</option>
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
export default {
  name: 'licenses',
  props: ['getPropertyGivenHotId', 'setProperty', 'waitForHotIdFromTabId'],
  data() {
    return {
      licenses: [
        {
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
        }
      ],
      selectedLicenses: [],
      licenseHints: [],
      licenseInput: []

    }
  },
  created: function() {
    this.initInput(this.getActiveTab)
  },
  watch: {
    getActiveTab: function(tab) {
      this.initInput(tab)
    }
  },
  computed: {
    ...mapGetters(['getActiveTab']),
    uniqueLicenses() {
      return _.uniq(this.selectedLicenses.concat(this.licenseInput))
    },
    collectedLicenses() {
      let unique = this.uniqueLicenses
      let lastInput = _.last(unique)
      let uniqueDrop = _.dropRight(unique)
      let licensesObject
      if (this.selectedLicenses.find(x => x.id === lastInput)) {
        licensesObject = this.licensesObject(unique)
      } else {
        licensesObject = this.licensesObject(uniqueDrop)
      }
      this.setProperty('licenses', licensesObject)
      return unique.join(',')
    }
  },
  methods: {
    ...mapMutations([
      'pushPackageProperty'
    ]),
    initInput: async function(tab) {
      let hotId = await this.waitForHotIdFromTabId(tab)
      this.selectedLicenses = []
      let licenseObjects = this.getPropertyGivenHotId('licenses', hotId) || []
      let licenseIds = licenseObjects.map(function(license) {
        return license.id
      })
      this.selectLicenseHints(licenseIds.join(','))
      // show all the hints on returning to tab
      this.licenseHints = this.licenses.map(x => {
        return x.id
      })
    },
    licensesObject: function(ids) {
      return this.licenses.filter(x => ids.indexOf(x.id) !== -1)
    },
    selectLicenseHints: function(value) {
      let splitArray = value.split(',')
      let lastInput = splitArray[splitArray.length-1]
      this.licenseInput = splitArray
      this.licenseHints = []
      let found = this.licenses.forEach(x => {
        if (x.id.toLowerCase().startsWith(lastInput.toLowerCase())) {
          this.licenseHints.push(x.id)
        }
      })
    }
  }
}
</script>
<style lang="styl" scoped>
@import '~static/css/license'
</style>
