<template>
  <div class="list-group" id="preferenceProperties">
    <a href="#" class="list-group-item"v-for="(menuItem, index) in menuItems" :key="index">
    {{menuItem}}
    </a>
</div>
</template>
<script>
export default {
  name: 'preferences',
  data() {
    return {
      menuItems: ['Guess column properties'
      ]
    }
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
