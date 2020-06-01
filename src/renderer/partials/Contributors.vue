<template>
  <div id="contributors">
    <div
      v-for="(contributor,gindex) in getContributors"
      :key="gindex"
      class="contributor col-sm-12"
    >
      <div class="inputs-container">
        <div
          v-for="prop in Object.keys(contributor)"
          :id="prop + gindex"
          :key="prop + gindex"
          class="input-group"
        >
          <span class="input-group-addon input-sm">{{ prop }}</span>
          <select
            v-if="prop === 'role'"
            :id="prop"
            :value="contributor[prop]"
            class="form-control input-sm"
            @input="setContributorProp(gindex, prop, $event.target.value)"
          >
            <option
              v-for="role in roles"
              :key="role"
              :value="role"
            >
              {{ role }}
            </option>
          </select>
          <input
            v-else
            :id="prop + gindex"
            v-validate="contributorValidationRules(prop, gindex)"
            :class="{ 'form-control input-sm': true, 'validate-danger': errors.has(getValidationProp(prop) + gindex) }"
            :value="contributor[prop]"
            :name="getValidationProp(prop) + gindex"
            type="text"
            @input="setContributorProp(gindex, prop, $event.target.value)"
          >
          <div
            v-show="errors.has(getValidationProp(prop) + gindex)"
            class="row help validate-danger"
          >
            {{ errors.first(getValidationProp(prop) + gindex) }}
          </div>
        </div>
      </div>
      <button
        type="button"
        class="btn btn-danger btn-sm"
        @click="removeContributor(gindex)"
      >
        <span class="glyphicon glyphicon-minus" />
      </button>
    </div>
    <div class="button-container">
      <button
        type="button"
        class="add-contributor btn btn-primary btn-sm"
        @click="addContributor()"
      >
        <span class="glyphicon glyphicon-plus" />Add contributor
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
  props: {
    setProperty: {
      type: Function,
      default: function () {}
    },
    getProperty: {
      type: Function,
      default: function () {}
    },
    getPropertyGivenHotId: {
      type: Function,
      default: function () {}
    },
    defaultSetter: {
      type: Function,
      default: undefined
    }
  },
  data () {
    return {
      contributors: []
    }
  },
  computed: {
    ...mapGetters(['getActiveTab']),
    regexForPath () {
      // no ../ or nulls or absolute paths allowed
      return /^(([.](?![.])|[^/.:]+)+[/]*)+$/
    },
    roles () {
      return ['author', 'publisher', 'maintainer', 'wrangler', 'contributor']
    },
    defaultRole () {
      return 'contributor'
    }
  },
  asyncComputed: {
    getContributors: {
      async get () {
        let contributors = this.getContributorsFromPackageProperties() || []
        for (const [index, contributor] of contributors.entries()) {
          if (contributor.role.trim() === '') {
            this.setProperty(`contributors[${index}]role`, this.defaultRole)
          }
        }
        return contributors
      },
      watch () {
        return this.contributors
      }
    }
  },
  mounted: function () {
    this.initContributors()
  },
  methods: {
    ...mapMutations([
      'pushPackageProperty'
    ]),
    getValidationProp: function (prop) {
      return prop === 'path' ? 'urlpath' : prop
    },
    removeContributor: function (index) {
      let contributors = this.getProperty('contributors')
      contributors.splice(index, 1)
      this.setProperty('contributors', contributors)
      this.contributors = contributors
    },
    addContributor: function () {
      let contributors = this.getProperty('contributors') || []
      contributors.push(this.emptyContributor())
      this.setProperty('contributors', contributors)
      this.contributors = contributors
    },
    emptyContributor: function () {
      return { 'title': '', 'path': '', 'email': '', 'role': '', 'organization': '' }
    },
    getContributorsFromPackageProperties: function () {
      let contributors = this.getProperty('contributors')
      return contributors
    },
    initContributors: function () {
      this.contributors = this.getContributorsFromPackageProperties()
    },
    setContributorProp: function (index, prop, value) {
      if (typeof this.defaultSetter !== 'undefined') {
        this.defaultSetter(index, prop, value, 'contributors')
      } else {
        this.setProperty(`contributors[${index}][${prop}]`, value)
      }
      let contributors = this.getProperty('contributors') || []
      this.contributors = contributors
    },
    contributorValidationRules: function (prop, index) {
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
  }
}
</script>
<style lang="styl" scoped>
@import '~static/css/contributors'
</style>
<style lang="styl" scoped>
@import '~static/css/validationrules'
</style>
