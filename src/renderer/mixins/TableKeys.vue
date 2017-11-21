<script>
import {
  mapMutations,
  mapState,
  mapGetters
} from 'vuex'
import { Subscription } from 'rxjs/Subscription'
import { Subject } from 'rxjs/Subject'
import VueRx from 'vue-rx'
import Vue from 'vue'
import {activeHotAllColumnNames} from '@/rxSubject.js'
Vue.use(VueRx, {
  Subscription,
  Subject
})
export default {
  name: 'tablekeys',
  props: ['waitForHotIdFromTabId', 'setProperty', 'getProperty', 'getPropertyGivenHotId', 'propertyName'],
  data() {
    return {
      selectedKeys: [],
      activeNames: []
    }
  },
  watch: {
    selectedKeys: function(values) {
      this.setProperty(this.propertyName, values)
    },
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
      let activeId = await this.waitForHotIdFromTabId(tab)
      return activeId
    },
    initTableHeaderKeys: function() {
      let allHotTablesColumnNames = this.getAllHotTablesColumnNames()
      activeHotAllColumnNames.next(allHotTablesColumnNames)
    },
    updateActiveNames: function(names) {
      this.activeNames = _.without(names, '')
    },
    updateSelectedKeys: function(hotId) {
      let value = this.getPropertyGivenHotId(this.propertyName, hotId) || []
      this.selectedKeys = value
    }
  },
  mounted: function() {
    let vueActiveId = this.initActiveId
    let vueUpdateActiveNames = this.updateActiveNames
    let vueUpdateSelectedKeys = this.updateSelectedKeys
    this.$subscribeTo(activeHotAllColumnNames, async function(allValues) {
      let id = await vueActiveId()
      let values = allValues[id]
      vueUpdateActiveNames(values)
      vueUpdateSelectedKeys(id)
    })
    this.initTableHeaderKeys()
  }
}
</script>
