<template>
<div>
  <div id="tablekeys">
    <!-- <label class="control-label col-sm-4" /> -->
    <select v-model="selectedKeys" class="form-control input-sm col-sm-9">
      <option v-for="columnName in getAllHotColumnNamesFromActiveHotId" :value="columnName">{{columnName}}</option>
    </select>
  </div>
</div>
</template>
<script>
import {
  mapMutations,
  mapState,
  mapGetters
} from 'vuex'
import {
  HotRegister
} from '../hot.js'
import AsyncComputed from 'vue-async-computed'
import Vue from 'vue'
Vue.use(AsyncComputed)
export default {
  name: 'licenses',
  props: ['waitForHotIdFromTabId'],
  data() {
    return {
      selectedKeys: []
    }
  },
  asyncComputed: {
    async getAllHotColumnNamesFromActiveHotId() {
      let tab = this.getActiveTab
      let hotId = await this.waitForHotIdFromTabId(tab)
      let activeHotColumns = this.getAllHotColumnNamesFromHotId(hotId)
      return activeHotColumns
    }
  },
  watch: {
    selectedKeys: function() {
      console.log('updated selected keys to:')
      console.log(this.selectedKeys)
    }
  },
  computed: {
    ...mapGetters(['getActiveTab', 'getAllHotColumnNamesFromHotId'])
  },
  methods: {

  },
  mounted: function() {

  }
}
</script>
<style lang="styl" scoped>
@import '~static/css/licenses'
</style>
