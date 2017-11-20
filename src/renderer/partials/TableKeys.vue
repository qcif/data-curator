<template>
<div>
  <div id="tablekeys">
    <select v-model="selectedKeys" class="form-control input-sm col-sm-9" multiple>
      <option v-for="columnName in activeNames" :value="columnName">{{columnName}}</option>
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
// import {
//   HotRegister
// } from '../hot.js'
// import AsyncComputed from 'vue-async-computed'
import { Subscription } from 'rxjs/Subscription'
import { Subject } from 'rxjs/Subject'
// import { startWith } from 'rxjs/add/operator/startWith'
// import { pluck } from 'rxjs/add/operator/pluck'
// import Rx from 'rxjs/Rx'
import VueRx from 'vue-rx'
import Vue from 'vue'
import {activeHotAllColumnNames} from '@/rxSubject.js'
// Vue.use(AsyncComputed)
Vue.use(VueRx, {
  Subscription,
  Subject
})
export default {
  name: 'licenses',
  props: ['waitForHotIdFromTabId', 'setProperty', 'getProperty'],
  data() {
    return {
      selectedKeys: [],
      activeNames: []
    }
  },
  watch: {
    selectedKeys: function(values) {
      this.setProperty('primaryKeys', values)
    },
    getActiveTab: function() {
      this.initTableKeys()
    }
  },
  computed: {
    ...mapGetters(['getActiveTab', 'getAllHotColumnNamesFromHotId', 'getAllHotTablesColumnNames'])
  },
  methods: {
    ...mapMutations(['pushAllColumnsProperty']),
    initActiveId: async function() {
      let tab = this.getActiveTab
      let activeId = await this.waitForHotIdFromTabId(tab)
      return activeId
    },
    initTableKeys: function() {
      let allHotTablesColumnNames = this.getAllHotTablesColumnNames()
      activeHotAllColumnNames.next(allHotTablesColumnNames)
    },
    updateActiveNames: function(names) {
      this.activeNames = _.without(names, '')
    }
  },
  mounted: function() {
    this.selectedKeys = this.getProperty('primaryKeys') || []
    let vueActiveId = this.initActiveId
    let vueUpdateActiveNames = this.updateActiveNames
    this.$subscribeTo(activeHotAllColumnNames, async function(allValues) {
      let id = await vueActiveId()
      let values = allValues[id]
      vueUpdateActiveNames(values)
    })
    this.initTableKeys()
  }
}
</script>
<style lang="styl" scoped>
@import '~static/css/licenses'
</style>
