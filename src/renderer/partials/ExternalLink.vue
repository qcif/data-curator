<template>
<a href="#" @click="openLink()">{{text}}</a>
</template>
<script>
import {shell} from 'electron'
export default {
  props: ['text', 'url'],
  name: 'externalLink',
  methods: {
    openLink: function() {
      shell.openExternal(this.url)
    }
  }
}
</script>
<style lang="styl" scoped>
@import '~static/css/tooltip'
</style>
