<template>
<form class="navbar-form form-horizontal" id="provenanceProperties">
  <div class="form-group-sm row container-fluid">
    <div>
      <label v-tooltip.left="tooltip('tooltip-provenance-description')" class="control-label col-sm-3">Description*</label>
      <component :is="'tooltipProvenanceDescription'" />
      <span>
        <button type="button" class="btn btn-primary btn-sm" @click="togglePreview()">
            <span class="provenance-preview-icon glyphicon" :class="buttonIconClass"/>{{buttonText}}
        </button>
      </span>
      <span class="provenance-errors-btn">
        <button v-show="!isPreview && provenanceHotErrors" type="button" class="btn btn-danger btn-sm" @click="removeAllErrors()">
            <span class="provenance-errors-icon fas fa-times-circle"/>Remove All Errors
        </button>
      </span>
      <template v-if="isPreview">
      <div v-html="markProvenanceText" class="col-sm-9" id="provenance-preview" />
      </template>
      <template v-else>
        <textarea v-model="provenance" :placeholder="placeholder" rows="25" cols="55" class="form-control input-sm col-sm-9" id="provenance-description" />
        <div id="provenance-errors-container">
          <div v-for="(errors, hotId) in provenanceHotErrors">
            <span class="provenance-errors-btn">
              <button v-show="!isPreview && provenanceHotErrors" type="button" class="btn btn-danger btn-sm" @click="removeErrors(hotId)">
                  <span class="provenance-errors-icon fas fa-times-circle"/>Remove Errors
              </button>
            </span>
            <textarea readonly="readonly" :value="errors" rows="10" cols="55" class="provenance-errors form-control input-sm col-sm-9" :id="'provenance-errors-' + hotId" />
          </div>
        </div>
      </template>
    </div>
  </div>
</form>
</template>
<script>
import SideNav from './SideNav'
import markdown from 'markdown-it/dist/markdown-it.min.js'
import ProvenanceTooltip from '../mixins/ProvenanceTooltip'
import {
  mapMutations,
  mapState,
  mapGetters
} from 'vuex'
import os from 'os'
import {provenanceErrors$} from '@/rxSubject.js'
import {compileHotErrors, stringifyProvenance} from '@/provenance.js'
export default {
  extends: SideNav,
  name: 'provenance',
  mixins: [ProvenanceTooltip],
  computed: {
    ...mapGetters([
      'getProvenance'
    ]),
    markProvenanceText() {
      const stringified = stringifyProvenance(this.provenance, this.provenanceHotErrors)
      return markdown().render(stringified)
    },
    buttonIconClass() {
      return this.isPreview ? 'glyphicon-pencil' : 'glyphicon-search'
    },
    buttonText() {
      return this.isPreview ? 'Edit' : 'Preview'
    }
  },
  methods: {
    ...mapMutations([
      'pushProvenance', 'removeProvenanceErrors', 'removeAllProvenanceErrors'
    ]),
    togglePreview: function() {
      this.isPreview = !this.isPreview
    },
    removeErrors: function(hotId) {
      this.removeProvenanceErrors(hotId)
      provenanceErrors$.next()
    },
    removeAllErrors: function() {
      this.resetProvenanceErrors()
      this.removeAllProvenanceErrors()
    },
    resetProvenanceErrors: function() {
      this.provenanceHotErrors = null
    },
    addErrorsToProvenance: function() {
      this.provenanceHotErrors = {}
      let self = this
      if (this.getProvenance.hotErrors) {
        _.forEach(this.getProvenance.hotErrors, function(errors, hotId) {
          const provenanceErrors = compileHotErrors(errors, hotId)
          // const tabTitle = self.getTabTitleFromHotId(hotId)
          // const provenanceErrors = self.compileErrors(errors, tabTitle)
          self.provenanceHotErrors[hotId] = provenanceErrors
        })
        this.focusErrors()
      }
    },

    focusErrors: function() {
      let element = document.querySelector('#provenance-errors-container')
      if (!element) {
        element = document.querySelector('#provenance-preview')
      }
      if (element) {
        element.focus()
      }
    }
  },
  watch: {
    provenance: function(value) {
      this.pushProvenance(value)
    }
  },
  mounted: function() {
    let self = this
    this.provenance = this.getProvenance.markdown
    this.$subscribeTo(provenanceErrors$, function() {
      self.addErrorsToProvenance()
    })
  },
  data() {
    return {
      isPreview: false,
      provenance: '',
      provenanceHotErrors: null,
      placeholder: `Short description of the dataset (the first sentence and first paragraph should be extractable to provide short standalone descriptions)

### Why was the dataset created?
reference legislation if relevant

### How was it collected
what events lead up to its collection?

### When was it collected?

### Where was it collected?

### Which instruments were used to collect it?

### What does “null” mean?
are null values unknown, missing or not applicable?

### Other comments

- error corrections
- transformations
- if the data had been aggregated, what level of detail can be expected
- known caveats or limitations in the data`
    }
  }
}
</script>
<style lang="styl" scoped>
@import '~static/css/provenanceprops'
</style>
