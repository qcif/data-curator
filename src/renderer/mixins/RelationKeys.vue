<script>
import {
  mapMutations,
  mapGetters
} from 'vuex'
import { Subscription } from 'rxjs/Subscription'
import VueRx from 'vue-rx'
import Vue from 'vue'
import {allTablesAllColumnNames$} from '@/rxSubject.js'
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
    ...mapGetters(['getActiveTab', 'getAllHotTablesColumnNames', 'getAllTabTitles', 'getTabObjects', 'getHotIdFromTabId', 'getSyncHotIdFromTabId', 'getAllForeignKeys', 'tabTitle'])
  },
  methods: {
    ...mapMutations(['pushForeignKeysLocalFieldsForTable', 'pushForeignKeysForeignFieldsForTable', 'pushForeignKeysForeignTableForTable']),
    initTableHeaderKeys: function() {
      allTablesAllColumnNames$.next(this.getAllHotTablesColumnNames())
    },
    getHotIdHeaderNames: function(allTablesAllNames, hotId) {
      console.log('triggered get hot id header names...')
      return _.without(allTablesAllNames[hotId], '', null, undefined)
    }
  },

  mounted: async function() {
    let self = this
    this.$subscribeTo(allTablesAllColumnNames$, async function(allTablesAllColumnNames) {
      // console.log('subscription for all tables all column names triggered...')
      // console.log(allTablesAllColumnNames)
      const hotId = await self.getHotIdFromTabId(self.getActiveTab)
      // console.log(`active hot id in subscription for all tables:`, hotId)
      await self.updateSubscriptions(allTablesAllColumnNames, hotId)
    })
    this.initTableHeaderKeys()
  }
}
</script>
