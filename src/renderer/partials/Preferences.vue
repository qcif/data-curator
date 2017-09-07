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
import {
  guessColumnProperties
} from '../frictionless.js'
export default {
  name: 'preferences',
  data() {
    return {
      menuItems: [{
        label: 'Guess column property',
        method: 'guessProperties'
      }]
    }
  },
  methods: {
    callback(methodName) {
      this.$emit(methodName)
    },
    ...mapMutations([
      'pushHotColumns'
    ]),
    async updateColumnProperties() {
      let hotColumns
      try {
        hotColumns = await guessColumnProperties()
      } catch (err) {
        console.log(err)
      }
      console.log('captured properties are:')
      console.log('hotColumns')
      this.pushHotColumns(hotColumns)
      // emit to column properties
    }
  },
  created: function() {
    this.$on('guessProperties', function() {
      this.updateColumnProperties()
    })
  }
}
</script>
<style scoped>
@import '~bootstrap/dist/css/bootstrap.min.css'
</style>
<style scoped>
@import '~static/css/panels'
</style>
<style lang="styl" scoped>
@import '~static/css/panel'
</style>
