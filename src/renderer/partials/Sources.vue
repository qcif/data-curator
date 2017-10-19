<template>
  <div id="sources">
    <div v-for="(source,index) in sources" :key="index" class="source col-sm-12">
      <div class="inputs-container">
        <div v-for="prop in ['title','path','email']" class="input-group">
          <span class="input-group-addon input-sm">{{prop}}</span>
          <input class="form-control input-sm" v-model="source[prop]" type="text" />
        </div>
      </div>
      <!-- <div class="button-container"> -->
        <!-- <div>&nbsp;</div> -->
        <button type="button" class="btn btn-danger btn-sm"><span class="glyphicon glyphicon-minus"></span></button>
        <!-- <div>&nbsp;</div> -->
      <!-- </div> -->
    </div>
  </div>
</template>
<script>
import {
  mapMutations,
  mapState,
  mapGetters
} from 'vuex'
import SideNav from './SideNav'
export default {
  name: 'sources',
  // props: ['pushLicenses'],
  extends: SideNav,
  watch: {
  },
  computed: {
    ...mapGetters(['getActiveTab'])
  },
  methods: {
    ...mapMutations([
      'pushPackageProperty'
    ])
  },
  data() {
    return {
      sources: [{
        title: '',
        path: '',
        email: ''
      }]
    }
  }
}
</script>
<style lang="styl" scoped>
@import '~static/css/sources'
</style>
