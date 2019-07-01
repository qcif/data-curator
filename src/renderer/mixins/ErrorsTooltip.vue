<script>
import Tooltip from '../mixins/Tooltip'
export default {
  components: {
    'tooltipOpenErrorsWindow': {
      template: '<div id="tooltip-open-errors-window">Open Errors in a New Window</div>'
    },
    'tooltipWriteErrorsProvenance': {
      template: '<div id="tooltip-write-errors-provenance">Write Errors to Provenance Information</div>'
    }
  },
  extends: Tooltip
}
</script>
