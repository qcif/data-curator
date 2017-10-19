<template>
  <div id="sources">
    <div v-for="(source,index) in sources" :key="index" class="source col-sm-12">
      <div class="inputs-container">
        <div v-for="prop in ['title','path','email']" class="input-group">
          <span class="input-group-addon input-sm">{{prop}}</span>
          <input class="form-control input-sm" v-model="source[prop]" type="text" />
        </div>
      </div>
        <button v-show="sources.length > 1" type="button" class="btn btn-danger btn-sm" @click="removeSource(index)">
          <span class="glyphicon glyphicon-minus"/>
        </button>
    </div>
    <div class="b">
      <button type="button" class="add-source btn btn-primary" @click="addSource()">
        <span class="glyphicon glyphicon-plus"/>Add source
      </button>
    </div>
    <!-- <div class="dummy">

    </div> -->
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
    ]),
    removeSource: function(index) {
      console.log(`index is ${index}`)
      this.sources.splice(index, 1)
      console.log(this.sources)
    },
    addSource: function() {
      let object = {}
      object.title = ''
      object.path = ''
      object.path = ''
      this.sources.push(object)
    }
  },
  data() {
    return {
      sources: []
    }
  },
  mounted() {
    this.addSource()
  }
}
</script>
<style lang="styl" scoped>
@import '~static/css/sources'
</style>
