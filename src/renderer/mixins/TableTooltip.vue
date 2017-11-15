<script>
import Tooltip from '../mixins/Tooltip'
import externalLink from '../partials/ExternalLink'
export default {
  extends: Tooltip,
  components: {
    externalLink,
    'tooltipTableName': {
      components: {externalLink},
      template: `<div id="tooltip-table-name">The
      <externalLink text="Name" url="http://frictionlessdata.io/specs/data-resource/#name"/> of the Table. Lower case, numbers, ".", "_", "-" characters only.</div>`
    },
    'tooltipTableTitle': {
      components: {externalLink},
      template: `<div id="tooltip-table-title">The
      <externalLink text="Title" url="http://frictionlessdata.io/specs/data-resource/#optional-properties"/> or one sentence description for this Table.</div>`
    },
    'tooltipTableDescription': {
      components: {externalLink},
      template: `<div id="tooltip-table-description">A
      <externalLink text="Description" url="http://frictionlessdata.io/specs/data-resource/#optional-properties"/> for the Table.</div>`
    },
    'tooltipTableSources': {
      components: {externalLink},
      template: `<div id="tooltip-table-sources">Each 
      <externalLink text="Source" url="http://frictionlessdata.io/specs/data-resource/#optional-properties"/> MUST have a title and MAY have path and/or email address.</div>`
    },
    'tooltipTableLicences': {
      components: {externalLink},
      template: `<div id="tooltip-table-licences">The Open
      <externalLink text="License" url="http://frictionlessdata.io/specs/data-resource/#optional-properties"/> under which the Table is provided.</div>`
    },
    'tooltipTablePrimaryKeys': {
      components: {externalLink},
      template: `<div id="tooltip-table-primary-keys">The
      <externalLink text="Primary Key" url="http://frictionlessdata.io/specs/table-schema/#primary-key"/> is the field(s) that uniquely identifies each row in the table. Separate values with a comma.</div>`
    },
    'tooltipTableMissingValues': {
      components: {externalLink},
      template: `<div id="tooltip-table-missing-values">Value(s) that indicate a
      <externalLink text="Missing Value" url="http://frictionlessdata.io/specs/table-schema/#missing-values"/>. Separate values with a comma.</div>`
    }
  }
}
</script>
