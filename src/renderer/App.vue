<template>
  <div id="app">
    <router-view
      v-show="routerName"
      :name="routerName"
    />
  </div>
</template>

<script>
export default {
  name: 'DataCurator',
  props: {
    routerName: {
      type: String,
      required: true
    }
  }
}
</script>
<style lang="styl" scoped>
@import '~static/css/default'
</style>
<style scoped>
@import '~bootstrap/dist/css/bootstrap.min.css'
</style>
