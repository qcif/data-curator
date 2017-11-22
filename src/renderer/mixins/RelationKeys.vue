<script>
import {
  mapMutations,
  mapState,
  mapGetters
} from 'vuex'
import { Subscription } from 'rxjs/Subscription'
import { Subject } from 'rxjs/Subject'
import {startWith} from 'rxjs/add/operator/startWith.js'
import VueRx from 'vue-rx'
import Vue from 'vue'
import {activeHotAllColumnNames} from '@/rxSubject.js'
import {
  HotRegister
} from '@/hot.js'
Vue.use(VueRx, {
  Subscription,
  Subject,
  startWith
})
export default {
  name: 'relationkeys',
  props: ['waitForHotIdFromTabId', 'setProperty', 'getProperty', 'getPropertyGivenHotId', 'propertyName'],
  watch: {
    getActiveTab: function() {
      this.initTableHeaderKeys()
    }
  },
  computed: {
    ...mapGetters(['getActiveTab', 'getAllHotColumnNamesFromHotId', 'getAllHotTablesColumnNames'])
  },
  methods: {
    ...mapMutations(['pushAllColumnsProperty']),
    initActiveId: async function() {
      let tab = this.getActiveTab
      let activeId = this.waitForHotIdFromTabId(tab)
      return activeId
    },
    initTableHeaderKeys: function() {
      let allHotTablesColumnNames = this.getAllHotTablesColumnNames()
      activeHotAllColumnNames.next(allHotTablesColumnNames)
    },
    // updateActiveNames: function(names) {
    //   this.activeNames = _.without(names, '')
    // },
    // updateSelectedKeys: function(hotId) {
    //   let value = this.getPropertyGivenHotId(this.propertyName, hotId) || []
    //   this.selectedKeys = value
    // }
    updateSubscriptions: function(names, id) {}
  },
  // subscriptions() {
  //   return {
  //     vueActiveId: this.waitForHotIdFromTabId()
  //   }
  // },
  mounted: function() {
    // let vueActiveId
    let vueActiveId = this.initActiveId
    // let vueUpdateActiveNames = this.updateActiveNames
    // let vueUpdateSelectedKeys = this.updateSelectedKeys
    let vueUpdateSubscriptions = this.updateSubscriptions
    this.$subscribeTo(activeHotAllColumnNames, async function(allNames) {
      let id = await vueActiveId()
      // let id = this.vueActiveId
      console.log('id is:')
      console.log(id)
      let names = allNames[id]
      vueUpdateSubscriptions(names, id)
    })
    this.initTableHeaderKeys()
  }
}
</script>
