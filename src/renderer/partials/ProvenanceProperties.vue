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
        <button v-show="!isPreview" type="button" class="btn btn-danger btn-sm">
            <span class="provenance-errors-icon fas fa-times-circle"/>Remove Errors
        </button>
      </span>
      <template v-if="isPreview">
      <div v-html="markProvenanceText" class="col-sm-9" id="provenance-preview" />
      <div v-html="markErrorsText" class="col-sm-9" id="provenance-errors-preview" />
      </template>
      <template v-else>
        <textarea v-model="provenance" :placeholder="placeholder" rows="25" cols="55" class="form-control input-sm col-sm-9" id="provenance-description" />
        <textarea readonly="readonly" v-model="provenanceErrors" rows="10" cols="55" class="form-control input-sm col-sm-9" id="provenance-errors" />
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
export default {
  extends: SideNav,
  name: 'provenance',
  mixins: [ProvenanceTooltip],
  computed: {
    ...mapGetters([
      'getProvenance'
    ]),
    markProvenanceText() {
      return markdown().render(this.provenance)
    },
    markErrorsText() {
      return markdown().render(this.provenanceErrors)
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
    resetProvenanceErrors: function() {
      this.provenanceErrors = ''
    },
    addErrorsToProvenance: function() {
      this.resetProvenanceErrors()
      this.provenanceErrors = this.compileErrors()
    },
    compileErrors: function() {
      let compiled = _.template(`### Known Data Errors

This data is published with the following data errors:

<%= errorsList %>`
      )
      return compiled({ 'errorsList': this.errorsListToString() })
    },
    errorsListToString: function() {
      return _.map(this.getProvenance.errors, function(error) {
        return `${error.message}${os.EOL}`
      })
    }
  },
  watch: {
    provenance: function(value) {
      this.pushProvenance(value)
    }
  },
  mounted: function() {
    this.provenance = this.getProvenance.markdown
    this.addErrorsToProvenance()
    document.querySelector('#provenance-errors').focus()
  },
  data() {
    return {
      isPreview: false,
      provenance: '',
      provenanceErrors: '',
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
