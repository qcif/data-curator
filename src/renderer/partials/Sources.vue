<template>
  <div id="sources">
    <div v-for="(source,index) in sources" :key="index" class="col-sm-12">
      <input v-model="source.title" type="text" />
      <input v-model="source.path"  type="text" />
      <input v-model="source.email" type="text" />
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
