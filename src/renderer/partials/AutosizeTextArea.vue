<template>
  <textarea></textarea>
</template>
<script>
import autosize from 'autosize'
export default {
  name: 'autosizeTextArea',
  props: {
    value: {
      default: ''
    }
  },
  mounted: function() {
    autosize(this.$el)
  }
}
</script>
