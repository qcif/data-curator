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
      <span class="provenance-errors">
        <button v-show="!isPreview && provenanceErrors" type="button" class="btn btn-danger btn-sm" @click="removeAllErrorsReferences()">
            <span class="provenance-errors-icon fas fa-times-circle"/>Remove Errors
        </button>
      </span>
      <template v-if="isPreview">
      <div v-html="markProvenanceText" class="col-sm-9" id="provenance-preview" />
      </template>
      <template v-else>
        <textarea v-model="provenance" :placeholder="placeholder" rows="25" cols="55" class="form-control input-sm col-sm-9" id="provenance-description" />
        <textarea ref="sidenavref" readonly="readonly" v-model="provenanceErrors" rows="10" cols="55" class="form-control input-sm col-sm-9" id="provenance-errors" />
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
export default {
  extends: SideNav,
  name: 'provenance',
  mixins: [ProvenanceTooltip],
  computed: {
    ...mapGetters([
      'getProvenance'
    ]),
    markProvenanceText() {
      return markdown().render(`${this.provenance}${os.EOL}${this.provenanceErrors}`)
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
      'pushProvenance', 'removeProvenanceErrors'
    ]),
    togglePreview: function() {
      this.isPreview = !this.isPreview
    },
    removeAllErrorsReferences: function() {
      this.resetProvenanceErrors()
      this.removeProvenanceErrors()
    },
    resetProvenanceErrors: function() {
      this.provenanceErrors = ''
    },
    addErrorsToProvenance: function() {
      // this.resetProvenanceErrors()
      if (this.getProvenance.errors.length > 0) {
        this.provenanceErrors = this.compileErrors()
        this.focusErrors()
      }
    },
    compileErrors: function() {
      let compiled = _.template(`${this.errorsPreText}<%= errorsList %>`)
      return compiled({ 'errorsList': this.errorsListToString() })
    },
    errorsListToString: function() {
      return _.map(this.getProvenance.errors, function(error) {
        return `${error.message}`
      }).join(os.EOL)
    },
    focusErrors: function() {
      document.querySelector('#provenance-errors').focus()
    }
  },
  watch: {
    provenance: function(value) {
      this.pushProvenance(value)
    }
  },
  mounted: function() {
    this.provenance = this.getProvenance.markdown
    const vueAddErrorsToProvenance = this.addErrorsToProvenance
    this.$subscribeTo(provenanceErrors$, function() {
      vueAddErrorsToProvenance()
    })
  },
  data() {
    return {
      isPreview: false,
      provenance: '',
      provenanceErrors: '',
      errorsPreText: `### Known Data Errors

This data is published with the following data errors:

`,
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
