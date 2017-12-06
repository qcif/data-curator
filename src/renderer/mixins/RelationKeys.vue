<script>
import {
  mapMutations,
  mapGetters
} from 'vuex'
import { Subscription } from 'rxjs/Subscription'
import VueRx from 'vue-rx'
import Vue from 'vue'
import {allTablesAllColumnNames$, activeTab$} from '@/rxSubject.js'
import {
  HotRegister
} from '@/hot.js'
Vue.use(VueRx, {
  Subscription
})
export default {
  name: 'relationkeys',
  watch: {
    getActiveTab: function() {
      console.log('got active tab in relation keys')
      this.initTableHeaderKeys()
    }
  },
  computed: {
    ...mapGetters(['getActiveTab', 'getAllHotTablesColumnNames', 'getAllTabTitles', 'getTabObjects'])
  },
  methods: {
    ...mapMutations(['pushAllColumnsProperty']),
    // ...mapGetters(['getAllTabTitles']),
    initTableHeaderKeys: function() {
      allTablesAllColumnNames$.next(this.getAllHotTablesColumnNames())
    },
    getHotIdHeaderNames: function(allTablesAllNames, hotId) {
      return _.without(allTablesAllNames[hotId], '', null, undefined)
    }
  },
  mounted: function() {
    // let vueCurrentHotId = this.currentHotId
    let vueUpdateSubscriptions = this.updateSubscriptions
    // TODO: need to manage subscription here...
    this.$subscribeTo(allTablesAllColumnNames$, async function(allTablesAllColumns) {
      console.log('subscribed to all tables all columns...')
      await vueUpdateSubscriptions(allTablesAllColumns)
    })
    this.initTableHeaderKeys()
  }
}
</script>
