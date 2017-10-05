<script>
import Tooltip from '../mixins/Tooltip'
export default {
  extends: Tooltip,
  components: {
    'tooltipTableName': {
      template: '<div class="tooltip-text" id="tooltip-table-name">The <a href="http://specs.frictionlessdata.io/data-resource/#name">Name</a>of the Table. Lower case, numbers, ".", "_", "-" characters only</div>'
    },
    'tooltipTableTitle': {
      template: '<div id="tooltip-table-title">The <a href="http://specs.frictionlessdata.io/data-resource/#optional-properties">Title</a> or one sentence description for this Table</div>'
    },
    'tooltipTableProfile': {
      template: '<div id="tooltip-table-profile">?</div>'
    },
    'tooltipTableDescription': {
      template: '<div id="tooltip-table-description">A <a href="http://specs.frictionlessdata.io/data-resource/#optional-properties">Description</a> for the Table</div>'
    },
    'tooltipTableSources': {
      template: '<div id="tooltip-table-sources">The <a href="http://specs.frictionlessdata.io/data-resource/#optional-properties">Sources</a> for the data in this Table. Each Source MUST have a title and MAY have path and/or email address.</div>'
    },
    'tooltipTableLicences': {
      template: '<div id="tooltip-table-licences">The Open <a href="http://specs.frictionlessdata.io/data-resource/#optional-properties">License</a> under which the Table is provided</div>'
    },
    'tooltipTableFormat': {
      template: '<div id="tooltip-table-format">?</div>'
    },
    'tooltipTableMediatype': {
      template: '<div id="tooltip-table-mediatype">?</div>'
    },
    'tooltipTableEncoding': {
      template: '<div id="tooltip-table-encoding">?</div>'
    },
    'tooltipTableMissingValues': {
      template: '<div id="tooltip-table-missing-values">Value(s) that indicate a <a href="http://specs.frictionlessdata.io/table-schema/#missing-values">Missing Value</a>. Separate values with a comma.</div>'
    }
  }
}
</script>
<style lang="styl" scoped>
@import '~static/css/panel'
</style>
