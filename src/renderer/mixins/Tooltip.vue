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
      object.delay = 80
      object.visible = property || false
      return object
    }
  }
}
</script>
