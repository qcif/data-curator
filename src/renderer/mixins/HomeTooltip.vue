<script>
import Tooltip from '../mixins/Tooltip'
export default {
  extends: Tooltip,
  components: {
    'tooltipValidate': {
      template: '<div id="tooltip-validate">Validate Table</div>'
    },
    'tooltipAddTab': {
      template: '<div id="tooltip-add-tab">Add Data Tab</div>'
    },
    'tooltipPrevious': {
      template: '<div id="tooltip-previous">Previous Property Panel</div>'
    },
    'tooltipNext': {
      template: '<div id="tooltip-next">Next Property Panel</div>'
    }
  }
}
</script>
