<script>
import {
  mapMutations,
  mapGetters
} from 'vuex'
import { Subscription } from 'rxjs/Subscription'
import VueRx from 'vue-rx'
import Vue from 'vue'
import {activeHotAllColumnNames$} from '@/rxSubject.js'
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
    ...mapGetters(['getActiveTab', 'getAllHotColumnNamesFromHotId', 'getAllHotTablesColumnNames'])
  },
  methods: {
    ...mapMutations(['pushAllColumnsProperty']),
    initTableHeaderKeys: function() {
      activeHotAllColumnNames$.next(this.getAllHotTablesColumnNames())
    }
  },
  mounted: function() {
    let vueCurrentHotId = this.currentHotId
    let vueUpdateSubscriptions = this.updateSubscriptions
    // TODO: need to manage subscription here...
    this.$subscribeTo(activeHotAllColumnNames$, async function(allNames) {
      let id = await vueCurrentHotId()
      console.log('subscription id is:')
      console.log(id)
      let names = allNames[id]
      vueUpdateSubscriptions(names, id)
    })
    this.initTableHeaderKeys()
  }
}
</script>
