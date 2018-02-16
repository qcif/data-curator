<template>
<div class="list-group" id="preferenceProperties">
  <a href="#" class="list-group-item" v-for="(menuItem, index) in menuItems" :key="index" @click="callback(menuItem.method)">
    {{menuItem.label}}
  </a>
</div>
</template>
<script>
import {
  mapMutations
} from 'vuex'
export default {
  name: 'preferences',
  data() {
    return {
      menuItems: []
    }
  },
  methods: {
    callback(methodName) {
      this.$emit(methodName)
    }
  },
  created: function() {
    // this.$on('guessProperties', function() {
    //   this.updateColumnProperties()
    // })
  }
}
</script>
<style scoped>
@import '~static/css/panels'
</style>
<style lang="styl" scoped>
@import '~static/css/panel'
</style>
