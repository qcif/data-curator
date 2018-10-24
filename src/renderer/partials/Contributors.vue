<template>
  <div id="contributors">
    <div
      v-for="(contributor,index) in getContributors"
      :key="index"
      class="contributor col-sm-12">
      <div class="inputs-container">
        <div
          v-for="prop in Object.keys(contributor)"
          class="input-group">
          <span class="input-group-addon input-sm">{{ prop }}</span>
          <select
            v-if="prop === 'role'"
            :value="contributor[prop]"
            :id="prop"
            class="form-control input-sm"
            @input="setContributorProp(index, prop, $event.target.value)" >
            <option
              v-for="role in roles"
              :key="role"
              :value="role">
              {{ role }}
            </option>
          </select>
          <input
            v-validate="contributorValidationRules(prop, index)"
            v-else
            :class="{ 'form-control input-sm': true, 'validate-danger': errors.has(getValidationProp(prop) + index) }"
            :value="contributor[prop]"
            :id="prop + index"
            :name="getValidationProp(prop) + index"
            type="text"
            @input="setContributorProp(index, prop, $event.target.value)">
          <div
            v-show="errors.has(getValidationProp(prop) + index)"
            class="row help validate-danger">
            {{ errors.first(getValidationProp(prop) + index) }}
          </div>
        </div>
      </div>
      <button
        type="button"
        class="btn btn-danger btn-sm"
        @click="removeContributor(index)">
        <span class="glyphicon glyphicon-minus"/>
      </button>
    </div>
    <div class="button-container">
      <button
        type="button"
        class="add-contributor btn btn-primary btn-sm"
        @click="addContributor()">
        <span class="glyphicon glyphicon-plus"/>Add contributor
      </button>
    </div>
  </div>
</template>
<script>
import {
  mapMutations,
  mapGetters
} from 'vuex'
import SideNav from './SideNav'
import AsyncComputed from 'vue-async-computed'
import ValidationRules from '../mixins/ValidationRules'
import Vue from 'vue'
Vue.use(AsyncComputed)
export default {
  name: 'Contributors',
  extends: SideNav,
  mixins: [ValidationRules],
  props: ['setProperty', 'getProperty', 'getPropertyGivenHotId', 'contributorsSetter'],
  data() {
    return {
      contributors: []
    }
  },
  computed: {
    ...mapGetters(['getActiveTab']),
    regexForPath() {
      // no ../ or nulls or absolute paths allowed
      return /^(([.](?![.])|[^/.:]+)+[/]*)+$/
    },
    roles() {
      return ['author', 'publisher', 'maintainer', 'wrangler', 'contributor']
    },
    defaultRole() {
      return 'contributor'
    }
  },
  asyncComputed: {
    getContributors: {
      async get() {
        let contributors = this.getContributorsFromPackageProperties() || []
        for (const [index, contributor] of contributors.entries()) {
          if (contributor.role.trim() === '') {
            this.setProperty(`contributors[${index}]role`, this.defaultRole)
          }
        }
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
      return { 'title': '', 'path': '', 'email': '', 'role': '', 'organization': '' }
    },
    getContributorsFromPackageProperties: function() {
      let contributors = this.getProperty('contributors')
      return contributors
    },
    initContributors: function() {
      this.contributors = this.getContributorsFromPackageProperties()
    },
    setContributorProp: function(index, prop, value) {
      if (typeof this.contributorsSetter !== 'undefined') {
        this.contributorsSetter(index, prop, value)
      } else {
        this.setProperty(`contributors[${index}][${prop}]`, value)
      }
      let contributors = this.getProperty('contributors') || []
      this.contributors = contributors
    },
    contributorValidationRules: function(prop, index) {
      switch (prop) {
        case 'email':
          return 'email'
        case 'title':
          return 'required'
        case 'path':
          return 'url'
        default:
          return ''
      }
    }
  },
  mounted: function() {
    this.initContributors()
  }
}
</script>
<style lang="styl" scoped>
@import '~static/css/contributors'
</style>
<style lang="styl" scoped>
@import '~static/css/validationrules'
</style>
