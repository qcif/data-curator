<template>
  <div id="sources">
    <div v-for="(source,index) in getSources" :key="index" class="source col-sm-12">
      <div class="inputs-container">
        <div v-for="prop in Object.keys(source)" class="input-group">
          <span class="input-group-addon input-sm">{{prop}}</span>
          <input class="form-control input-sm" :value="source[prop]" @input="setSourceProp(index, prop, $event.target.value)" type="text" />
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
import Vue from 'vue'
Vue.use(AsyncComputed)
export default {
  name: 'sources',
  data() {
    return {
      sources: []
    }
  },
  props: ['setProperty', 'getProperty', 'getPropertyGivenHotId'],
  extends: SideNav,
  computed: {
    ...mapGetters(['getActiveTab'])
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
    emptySource() {
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
    setSourceProp: function(index, prop, value) {
      this.setProperty(`sources[${index}][${prop}]`, value)
      let sources = this.getProperty('sources') || []
      this.sources = sources
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
