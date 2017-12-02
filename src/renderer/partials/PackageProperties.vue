<template>
<form class="navbar-form form-horizontal" id="packageProperties">
  <div class="form-group-sm row container-fluid">
    <div class="propertyrow" v-for="(formprop, index) in formprops" :key="index">
      <label class="control-label col-sm-3" :for="formprop.label">{{formprop.label}}{{formprop.isMandatory ? '*' : ''}}:</label>
      <component v-if="isSharedComponent(formprop.label)" :getProperty="getProperty" :getPropertyGivenHotId="getPropertyGivenHotId" :setProperty="setProperty" :waitForHotIdFromTabId="waitForHotIdFromTabId" :is="formprop.label"/>
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
import ValidationRules from '../mixins/ValidationRules'
import {
  mapMutations,
  mapState,
  mapGetters
} from 'vuex'
export default {
  extends: SideNav,
  name: 'packager',
  mixins: [ValidationRules],
  components: {
    licenses,
    sources
  },
  data() {
    return {
      formprops: [{
        label: 'name',
        type: 'input',
        isMandatory: true
      },
      {
        label: 'id',
        type: 'input'
      },
      {
        label: 'title',
        type: 'input'
      },
      {
        label: 'description',
        type: 'markdown'
      },
        // lead user through with http://frictionlessdata.io/specs/patterns/#data-package-version
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
  },
  mounted: function() {
    const dict = {
      en: {
        custom: {
          version: {
            regex: 'The version field must comply with semantic versioning.'
          }
        }
      }
    }
    this.$validator.updateDictionary(dict)
  }
}
</script>
<style lang="styl" scoped>
@import '~static/css/packageprops'
</style>
<style lang="styl" scoped>
@import '~static/css/validationrules'
</style>
