<template>
  <div id="sources">
    <div v-for="(source,index) in getSources" :key="index" class="source col-sm-12">
      <div class="inputs-container">
        <div v-for="prop in Object.keys(source)" class="input-group">
          <span class="input-group-addon input-sm">{{prop}}</span>
          <input :class="{ 'form-control input-sm': true, 'validate-danger': errors.has(prop + index) }" :value="source[prop]" @input="setSourceProp(index, prop, $event.target.value)" type="text" :id="prop + index" v-validate="sourceValidationRules(prop)" :name="prop + index"/>
          <div v-show="errors.has(prop + index) || errors.has('coupon')" class="row help validate-danger">
            {{ errors}}
          </div>
        </div>
      </div>
      <button v-show="getSources.length > 1" type="button" class="btn btn-danger btn-sm" @click="removeSource(index)">
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
      return /^([.](?![.])(?=[/]))?(([^\0])+[/]?)+$/
    }
  },
  asyncComputed: {
    getSources: {
      async get() {
        let tab = this.getActiveTab
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
    initSources: async function(tab) {
      let sources = await this.getSourcesFromTab(tab)
      if (!sources) {
        const vueAddSource = this.addSource
        _.delay(function() {
          vueAddSource()
        }, 100)
      }
    },
    setSourceProp: async function(index, prop, value) {
      let vueValidator = this.$validator.errors
      let sourceErrors = true
      if (prop === 'path') {
        try {
          sourceErrors = await this.$validator.validateAll({sourcePath: value, sourceUrl: value})
        } catch (err) {
          console.log('Problem with validation', err)
        }
      }
      this.setProperty(`sources[${index}][${prop}]`, value)
      let sources = this.getProperty('sources') || []
      this.sources = sources
      let name = `${prop}${index}`
      if (!sourceErrors) {
        if (!this.$validator.errors.has('sourcePath') || !this.$validator.errors.has('sourceUrl')) {
          // 1 of validations passed so ensure neither error message remains
          this.$validator.errors.remove('sourcePath')
          this.$validator.errors.remove('sourceUrl')
        } else if (this.$validator.errors.has('sourcePath') && this.$validator.errors.has('sourceUrl')) {
          // we only need 1 error message
          this.$validator.errors.remove('sourcePath')
        }
      }

      console.log(this.$validator.errors)
    },
    sourceValidationRules: function(prop) {
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
  },
  beforeDestroy: function() {
    this.$validator.detach('sourceUrl')
    this.$validator.detach('sourcePath')
  },
  created: function() {
    this.$validator.attach({
      name: 'sourceUrl',
      rules: 'url:true'
    })
    this.$validator.attach({
      name: 'sourcePath',
      rules: {
        regex: this.regexForPath
      }
    })
  }
}
</script>
<style lang="styl" scoped>
@import '~static/css/sources'
</style>
<style lang="styl" scoped>
@import '~static/css/validationrules'
</style>
