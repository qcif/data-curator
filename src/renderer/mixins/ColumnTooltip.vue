<script>
import Tooltip from '../mixins/Tooltip'
import externalLink from '../partials/ExternalLink'
export default {
  components: {
    externalLink,
    'tooltipColumnName': {
      components: { externalLink },
      template: `<div id="tooltip-column-name">
      <externalLink text="Name" url="http://frictionlessdata.io/specs/table-schema/#name"/> is usually the value of the first row in the column. Where no name is set, select 'Header Row' from the Tools menu to assign column names.</div>`
    },
    'tooltipColumnTitle': {
      components: { externalLink },
      template: `<div id="tooltip-column-title">A human readable
      <externalLink text="Title" url="http://frictionlessdata.io/specs/table-schema/#title"/> for the column</div>`
    },
    'tooltipColumnDescription': {
      components: { externalLink },
      template: `<div id="tooltip-column-description">A
      <externalLink text="Description" url="http://frictionlessdata.io/specs/table-schema/#description"/> of the column</div>`
    },
    'tooltipColumnType': {
      components: { externalLink },
      template: `<div id="tooltip-column-type">Choose a
      <externalLink text="Type" url="http://frictionlessdata.io/specs/table-schema/#types-and-formats"/> for the data in the column</div>`
    },
    'tooltipColumnTypeDateDefault': {
      template: `<div id="tooltip-column-type-date-default"><span style="color:#ff3860;">Warning:</span> Format: 'default', for type: 'date', ensures that validation will resolve dates set beyond calendar limits (e.g., 2022-22-22 will pass validation as 2023-10-22)</div>`
    },
    'tooltipColumnFormat': {
      components: { externalLink },
      template: `<div id="tooltip-column-format">Choose the
      <externalLink text="Format" url="http://frictionlessdata.io/specs/table-schema/#types-and-formats"/> for the Type of data</div>`
    },
    'tooltipColumnConstraints': {
      components: { externalLink },
      template: `<div id="tooltip-column-constraints">Set a
      <externalLink text="Constraint" url="http://frictionlessdata.io/specs/table-schema/#constraints"/> to limit valid values</div>`
    },
    'tooltipColumnRdfType': {
      components: { externalLink },
      template: `<div id="tooltip-column-rdfType">Set a
      <externalLink text="RDF Type" url="http://frictionlessdata.io/specs/table-schema/#rich-types"/> to provide extra meaning to the data</div>`
    }
  },
  extends: Tooltip
}
</script>
