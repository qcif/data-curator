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
      this.initTableHeaderKeys()
    }
  },
  computed: {
    ...mapGetters(['getActiveTab', 'getAllHotTablesColumnNames', 'getAllTabTitles', 'getTabObjects', 'getHotIdFromTabId', 'getTabId', 'getAllForeignKeys', 'tabTitle'])
  },
  methods: {
    ...mapMutations(['pushAllColumnsProperty', 'pushForeignKeysLocalFieldsForTable', 'pushForeignKeysForeignFieldsForTable', 'pushForeignKeysForeignTableForTable']),
    initTableHeaderKeys: function() {
      allTablesAllColumnNames$.next(this.getAllHotTablesColumnNames())
    },
    getHotIdHeaderNames: function(allTablesAllNames, hotId) {
      return _.without(allTablesAllNames[hotId], '', null, undefined)
    }
  },
  mounted: async function() {
    let vueUpdateSubscriptions = this.updateSubscriptions
    this.$subscribeTo(allTablesAllColumnNames$, async function(allTablesAllColumnNames) {
      console.log('subscribed to all tables all columns...')
      await vueUpdateSubscriptions(allTablesAllColumnNames)
    })
    this.initTableHeaderKeys()
  }
}
</script>
