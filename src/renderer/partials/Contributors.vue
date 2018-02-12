<template>
  <div id="contributors">
    <div v-for="(contributor,index) in getContributors" :key="index" class="contributor col-sm-12">
      <div class="inputs-container">
        <div v-for="prop in Object.keys(contributor)" class="input-group">
          <span class="input-group-addon input-sm">{{prop}}</span>
          <input :class="{ 'form-control input-sm': true, 'validate-danger': errors.has(getValidationProp(prop) + index) }" :value="contributor[prop]" @input="setContributorProp(index, prop, $event.target.value)" type="text" :id="prop + index" v-validate="contributorValidationRules(prop, index)" :name="getValidationProp(prop) + index"/>
          <div v-show="errors.has(getValidationProp(prop) + index)" class="row help validate-danger">
            {{ errors.first(getValidationProp(prop) + index)}}
          </div>
        </div>
      </div>
      <button v-show="getContributors.length > 1" type="button" class="btn btn-danger btn-sm" @click="removeContributor(index)">
        <span class="glyphicon glyphicon-minus"/>
      </button>
    </div>
    <div class="button-container">
      <button type="button" class="add-contributor btn btn-primary btn-sm" @click="addContributor()">
        <span class="glyphicon glyphicon-plus"/>Add contributor
      </button>
    </div>
  </div>
</template>
<script>
import {
  mapMutations,
  mapState,
  mapGetters
} from 'vuex'
import SideNav from './SideNav'
import AsyncComputed from 'vue-async-computed'
import ValidationRules from '../mixins/ValidationRules'
import VeeValidate from 'vee-validate'
import Vue from 'vue'
Vue.use(AsyncComputed)
export default {
  name: 'contributors',
  mixins: [ValidationRules],
  data() {
    return {
      contributors: []
    }
  },
  props: ['setProperty', 'getProperty', 'getPropertyGivenHotId'],
  extends: SideNav,
  computed: {
    ...mapGetters(['getActiveTab']),
    regexForPath() {
      // no ../ or nulls or absolute paths allowed
      return /^(([.](?![.])|[^/.:]+)+[/]*)+$/
    },
    roles() {
      return ['author', 'publisher', 'maintainer', 'wrangler', 'contributor']
    }
  },
  asyncComputed: {
    getContributors: {
      async get() {
        let tab = this.getActiveTab
        let contributors = await this.getContributorsFromTab(tab)
        return contributors
      },
      watch() {
        return this.contributors
      }
    }
  },
  methods: {
    ...mapMutations([
      'pushPackageProperty'
    ]),
    getValidationProp: function(prop) {
      return prop === 'path' ? 'urlpath' : prop
    },
    removeContributor: function(index) {
      let contributors = this.getProperty('contributors')
      contributors.splice(index, 1)
      this.setProperty('contributors', contributors)
      this.contributors = contributors
    },
    addContributor: function() {
      let contributors = this.getProperty('contributors') || []
      contributors.push(this.emptyContributor())
      this.setProperty('contributors', contributors)
      this.contributors = contributors
    },
    emptyContributor: function() {
      return {'title': '', 'path': '', 'email': '', 'role': '', 'organization': ''}
    },
    getContributorsFromTab: async function(tab) {
      let hotId = await this.waitForHotIdFromTabId(tab)
      let contributors = this.getPropertyGivenHotId('contributors', hotId)
      return contributors
    },
    initContributors: async function(tab) {
      let contributors = await this.getContributorsFromTab(tab)
      if (!contributors) {
        const vueAddContributor = this.addContributor
        _.delay(function() {
          vueAddContributor()
        }, 100)
      }
    },
    setContributorProp: function(index, prop, value) {
      this.setProperty(`contributors[${index}][${prop}]`, value)
      let contributors = this.getProperty('contributors') || []
      this.contributors = contributors
      if (prop === 'path') {
        this.validateUrlOrPath(index, value)
      }
    },
    validateUrlOrPath: async function(index, value) {
      let prop = 'path'
      let field = `${prop}${index}`
      try {
        let hasValidUrl = await this.validateUrl(field, value)
        let hasValidPath = await this.validatePath(field, value)
        this.$validator.detach(field)
        if (!hasValidUrl && !hasValidPath) {
          this.$validator.errors.add({field: field, msg: 'The path field must be a valid email or path.'})
        }
      } catch (err) {
        console.log('Problem with validation', err)
      }
    },
    validateUrl: async function(field, value) {
      // keep url:true as string for validation to work correctly
      return this.validate(field, value, 'url:true')
    },
    validatePath: async function(field, value) {
      return this.validate(field, value, {
        regex: this.regexForPath
      })
    },
    validate: async function(field, value, rules) {
      let isValid = true
      // ensure there are no other fields by this name
      this.$validator.detach(field)
      await this.$validator.attach({
        name: field,
        rules: rules
      })
      isValid = await this.$validator.validate(field, value)
      this.$validator.detach(field)
      // console.log(isValid)
      return isValid
    },
    contributorValidationRules: function(prop, index) {
      switch (prop) {
        case 'email':
          return 'email'
        case 'title':
          return 'required'
        case 'path':
          return 'url'
        case 'role':
          return {
            in: this.roles
          }
        default:
          return ''
      }
    }
  },
  mounted: function() {
    let tab = this.getActiveTab
    this.initContributors(tab)
  },
  watch: {
    getActiveTab: function(tab) {
      this.initContributors(tab)
    }
  }
}
</script>
<style lang="styl" scoped>
@import '~static/css/contributors'
</style>
<style lang="styl" scoped>
@import '~static/css/validationrules'
</style>
