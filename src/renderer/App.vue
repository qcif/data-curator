<template>
  <div id="app">
    <router-view v-show="routerName" :name="routerName"></router-view>
  </div>
</template>

<script>
  export default {
    name: 'data-curator',
    props: ['routerName'],
    mounted: function () {
      console.log('mounted root')
      console.log(`router name is ${this.routerName}`)
    }
  }
</script>
<style lang="styl" scoped>
@import '~static/css/default'
</style>
