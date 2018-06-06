<template>
  <div id="sources">
    <div v-for="(source,index) in getSources" :key="index" class="source col-sm-12">
      <div class="inputs-container">
        <div v-for="prop in Object.keys(source)" class="input-group">
          <span class="input-group-addon input-sm">{{prop}}</span>
          <input :class="{ 'form-control input-sm': true, 'validate-danger': errors.has(prop + index) }" :value="source[prop]" @input="setSourceProp(index, prop, $event.target.value)" type="text" :id="prop + index" v-validate="sourceValidationRules(prop, index)" :name="prop + index"/>
          <div v-show="errors.has(prop + index)" class="row help validate-danger">
            {{ errors.first(prop + index)}}
          </div>
        </div>
      </div>
      <button type="button" class="btn btn-danger btn-sm" @click="removeSource(index)">
        <span class="glyphicon glyphicon-minus"/>
      </button>
    </div>
    <div class="button-container">
      <button type="button" class="add-source btn btn-primary btn-sm" @click="addSource()">
        <span class="glyphicon glyphicon-plus"/>Add source
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
  name: 'sources',
  mixins: [ValidationRules],
  data() {
    return {
      sources: []
    }
  },
  props: ['setProperty', 'getProperty', 'getPropertyGivenHotId'],
  extends: SideNav,
  computed: {
    ...mapGetters(['getActiveTab']),
    regexForPath() {
      // no ../ or nulls or absolute paths allowed
      return /^(([.](?![.])|[^/.:]+)+[/]*)+$/
    }
  },
  asyncComputed: {
    getSources: {
      async get() {
        let tab = this.getActiveTab
        // TODO: may need distinction here for package vs tables
        let sources = await this.getSourcesFromTab(tab)
        return sources
      },
      watch() {
        return this.sources
      }
    }
  },
  methods: {
    ...mapMutations([
      'pushPackageProperty'
    ]),
    removeSource: function(index) {
      let sources = this.getProperty('sources')
      sources.splice(index, 1)
      this.setProperty('sources', sources)
      this.sources = sources
    },
    addSource: function() {
      let sources = this.getProperty('sources') || []
      sources.push(this.emptySource())
      this.setProperty('sources', sources)
      this.sources = sources
    },
    emptySource: function() {
      return {'title': '', 'path': '', 'email': ''}
    },
    getSourcesFromTab: async function(tab) {
      let hotId = await this.waitForHotIdFromTabId(tab)
      let sources = this.getPropertyGivenHotId('sources', hotId)
      return sources
    },
    // TODO: fix this redundant method
    initSources: async function(tab) {
      let sources = await this.getSourcesFromTab(tab)
    },
    setSourceProp: function(index, prop, value) {
      this.setProperty(`sources[${index}][${prop}]`, value)
      let sources = this.getProperty('sources') || []
      this.sources = sources
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
          this.$validator.errors.add({field: field, msg: 'The path field must be a valid url or path.'})
        }
      } catch (err) {
        console.error('Problem with validation', err)
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
    sourceValidationRules: function(prop, index) {
      switch (prop) {
        case 'email':
          return 'email'
        case 'title':
          return 'required'
        default:
          return ''
      }
    }
  },
  mounted: function() {
    let tab = this.getActiveTab
    this.initSources(tab)
  },
  watch: {
    getActiveTab: function(tab) {
      this.initSources(tab)
    }
  }
}
</script>
<style lang="styl" scoped>
@import '~static/css/sources'
</style>
<style lang="styl" scoped>
@import '~static/css/validationrules'
</style>
