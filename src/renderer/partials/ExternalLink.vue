<template>
  <a
    href="#"
    @click="openLink()"
  >{{ text }}</a>
</template>
<script>
import { shell } from 'electron'
export default {
  name: 'ExternalLink',
  props: {
    text: {
      type: String,
      default: ''
    },
    url: {
      type: String,
      default: ''
    }
  },
  methods: {
    openLink: function () {
      shell.openExternal(this.url)
    }
  }
}
</script>
<style lang="styl" scoped>
@import '~static/css/tooltip'
</style>
