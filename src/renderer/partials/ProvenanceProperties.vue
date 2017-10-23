<template>
<form class="navbar-form form-horizontal" id="provenanceProperties">
  <div class="form-group-sm row container-fluid">
    <div>
      <label class="control-label col-sm-3">description:</label>
      <span>
        <button type="button" class="btn btn-primary btn-sm" @click="togglePreview()">
          <span class="glyphicon glyphicon-search"/>Preview
        </button>
      </span>
      <div v-if="isPreview" v-html="markText" class="col-sm-9" id="preview" />
      <textarea v-else v-model="provenance" :placeholder = "placeholder" rows="25" cols="55" class="form-control input-sm col-sm-9" id="description" />
    </div>
  </div>
</form>
</template>
<script>
import SideNav from './SideNav'
import 'bootstrap/dist/js/bootstrap.min.js'
import markdown from 'markdown-it/dist/markdown-it.min.js'
const md = markdown()
export default {
  extends: SideNav,
  name: 'provenance',
  computed: {
    markText() {
      return md.render(this.provenance)
    }
  },
  methods: {
    togglePreview: function() {
      this.isPreview = !this.isPreview
    }
  },
  data() {
    return {
      isPreview: false,
      formprops: [{
        label: 'description',
        type: 'markdown'
      }],
      provenance: '',
      placeholder:
`### Introduction

### Why was the dataset created? (reference legislation if relevant)

### How was it collected - what events lead up to its collection?

### When was it collected? (Temporal extent)

### Where was it collected? (Spatial extent name, coordinate reference system, minimum bounding rectangle)

### Which instruments were used to collect it?

### What does “null” mean? Unknown, missing or not applicable?

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
