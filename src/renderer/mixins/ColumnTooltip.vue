<script>
import Tooltip from '../mixins/Tooltip'
export default {
  extends: Tooltip,
  components: {
    'tooltipColumnName': {
      template: '<div id="tooltip-column-name">The <a href="http://specs.frictionlessdata.io/table-schema/#name">Name</a> of the column. Usually the value of the first row in the column.</div>'
    },
    'tooltipColumnTitle': {
      template: '<div id="tooltip-column-title">A human readable <a href="http://specs.frictionlessdata.io/table-schema/#title">Title</a> for the column.</div>'
    }
  }
}
</script>
