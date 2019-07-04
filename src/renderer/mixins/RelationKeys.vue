<script>
import {
  mapMutations,
  mapGetters
} from 'vuex'
import { Subscription } from 'rxjs/Subscription'
import VueRx from 'vue-rx'
import Vue from 'vue'
import { allTablesAllColumnNames$ } from '@/rxSubject.js'
Vue.use(VueRx, {
  Subscription
})
export default {
  name: 'Relationkeys',
  computed: {
    ...mapGetters(['getActiveTab', 'getAllHotTablesColumnNames', 'getAllTabTitles', 'getTabObjects', 'getHotIdFromTabId', 'getSyncHotIdFromTabId', 'getAllForeignKeys', 'tabTitle'])
  },
  watch: {
    getActiveTab: function () {
      this.initTableHeaderKeys()
    }
  },
  mounted: async function () {
    let self = this
    this.$subscribeTo(allTablesAllColumnNames$, async function (allTablesAllColumnNames) {
      const hotId = await self.getHotIdFromTabId(self.getActiveTab)
      await self.updateSubscriptions(allTablesAllColumnNames, hotId)
    })
    this.initTableHeaderKeys()
  },
  methods: {
    ...mapMutations(['pushForeignKeysLocalFieldsForTable', 'pushForeignKeysForeignFieldsForTable', 'pushForeignKeysForeignTableForTable']),
    initTableHeaderKeys: function () {
      allTablesAllColumnNames$.next(this.getAllHotTablesColumnNames())
    },
    getHotIdHeaderNames: function (allTablesAllNames, hotId) {
      return _.without(allTablesAllNames[hotId], '', null, undefined)
    }
  }

}
</script>
