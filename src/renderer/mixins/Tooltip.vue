<script>
import Vue from 'vue'
import Tooltip from 'vue-directive-tooltip'
import 'vue-directive-tooltip/css/index.css'
Vue.use(Tooltip)
export default {
  methods: {
    tooltip: function(property) {
      let object = {}
      object.html = property
      // ensure delay is long enough to allow hover over tooltip when it contains link, but short enough so tooltip closes before another opens
      object.delay = 80
      object.class = 'tooltip-custom'
      object.visible = property || false
      return object
    }
  }
}
</script>
<!-- no 'scoped' style so it can apply to component tooltips -->
<style lang="styl">
@import '~static/css/tooltip'
</style>
