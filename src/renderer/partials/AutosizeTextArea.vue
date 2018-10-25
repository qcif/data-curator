<template>
  <textarea/>
</template>
<script>
import autosize from 'autosize'
export default {
  name: 'AutosizeTextArea',
  props: {
    value: {
      type: String,
      default: ''
    }
  },
  mounted: function() {
    autosize(this.$el)
  }
}
</script>
