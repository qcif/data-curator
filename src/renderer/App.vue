<template>
  <div id="app">
    <router-view v-show="routerName" :name="routerName"></router-view>
  </div>
</template>

<script>
  export default {
    name: 'data-curator',
    props: ['routerName']
  }
</script>
<style lang="styl" scoped>
@import '~static/css/default'
</style>
<style scoped>
@import '~bootstrap/dist/css/bootstrap.min.css'
</style>
