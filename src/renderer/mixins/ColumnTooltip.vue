<script>
import Tooltip from '../mixins/Tooltip'
import externalLink from '../partials/ExternalLink'
export default {
  extends: Tooltip,
  components: {
    externalLink,
    'tooltipColumnName': {
      components: {externalLink},
      template: `<div id="tooltip-column-name">The
      <externalLink text="Name" url="http://frictionlessdata.io/specs/table-schema/#name"/> Usually the value of the first row in the column.</div>`
    },
    'tooltipColumnTitle': {
      components: {externalLink},
      template: `<div id="tooltip-column-title">A human readable
      <externalLink text="Title" url="http://frictionlessdata.io/specs/table-schema/#title"/> for the column.</div>`
    },
    'tooltipColumnDescription': {
      components: {externalLink},
      template: `<div id="tooltip-column-description">A
      <externalLink text="Description" url="http://frictionlessdata.io/specs/table-schema/#description"/> of the column.</div>`
    },
    'tooltipColumnType': {
      components: {externalLink},
      template: `<div id="tooltip-column-type">Choose a
      <externalLink text="Type" url="http://frictionlessdata.io/specs/table-schema/#types-and-formats"/> for the data in the column.</div>`
    },
    'tooltipColumnFormat': {
      components: {externalLink},
      template: `<div id="tooltip-column-format">Choose the
      <externalLink text="Format" url="http://frictionlessdata.io/specs/table-schema/#types-and-formats"/> for the Type of data.</div>`
    },
    'tooltipColumnConstraints': {
      components: {externalLink},
      template: `<div id="tooltip-column-constraints">Set a
      <externalLink text="Constraint" url="http://frictionlessdata.io/specs/table-schema/#constraints"/> to limit valid values.</div>`
    },
    'tooltipColumnRdfType': {
      components: {externalLink},
      template: `<div id="tooltip-column-rdfType">Set a
      <externalLink text="RDF Type" url="http://frictionlessdata.io/specs/table-schema/#rich-types"/> to provide extra meaning to the Type.</div>`
    }
  }
}
</script>
