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
      <div v-if="isPreview" v-html="markText" class="col-sm-9" id="preview" />
      <textarea v-else v-model="provenance" :placeholder="placeholder" rows="25" cols="55" class="form-control input-sm col-sm-9" id="description" />
    </div>
  </div>
</form>
</template>
<script>
import SideNav from './SideNav'
import 'bootstrap/dist/js/bootstrap.min.js'
import markdown from 'markdown-it/dist/markdown-it.min.js'
import ProvenanceTooltip from '../mixins/ProvenanceTooltip'
import {
  mapMutations,
  mapState,
  mapGetters
} from 'vuex'
export default {
  extends: SideNav,
  name: 'provenance',
  mixins: [ProvenanceTooltip],
  computed: {
    ...mapGetters([
      'getProvenance'
    ]),
    markText() {
      return markdown().render(this.provenance)
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
      'pushProvenance'
    ]),
    togglePreview: function() {
      this.isPreview = !this.isPreview
    }
  },
  watch: {
    provenance: function(value) {
      this.pushProvenance(value)
    }
  },
  mounted: function() {
    this.provenance = this.getProvenance.markdown
  },
  data() {
    return {
      isPreview: false,
      provenance: '',
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
<style scoped>
@import '~bootstrap/dist/css/bootstrap.min.css'
</style>
<style lang="styl" scoped>
@import '~static/css/provenanceprops'
</style>
