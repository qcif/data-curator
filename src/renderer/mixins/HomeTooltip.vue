<script>
import Tooltip from '../mixins/Tooltip'
export default {
  components: {
    'tooltipValidate': {
      template: '<div id="tooltip-validate">Validate Table</div>'
    },
    'tooltipColumn': {
      template: '<div id="tooltip-column">Set Column Properties</div>'
    },
    'tooltipTable': {
      template: '<div id="tooltip-table">Set Table Properties</div>'
    },
    'tooltipGuess': {
      template: '<div id="tooltip-guess">Guess Column Properties</div>'
    },
    'tooltipProvenance': {
      template: '<div id="tooltip-provenance">Set Provenance Information</div>'
    },
    'tooltipPackage': {
      template: '<div id="tooltip-package">Set Data Package Properties</div>'
    },
    'tooltipFind': {
      template: '<div id="tooltip-find">Find and Replace Data</div>'
    },
    'tooltipExport': {
      template: '<div id="tooltip-export">Export Data Package</div>'
    },
    'tooltipAddTab': {
      template: '<div id="tooltip-add-tab">Add Data Tab</div>'
    },
    'tooltipPrevious': {
      template: '<div id="tooltip-previous">Previous Column Property</div>'
    },
    'tooltipNext': {
      template: '<div id="tooltip-next">Next Column Property</div>'
    }
  },
  extends: Tooltip
}
</script>
