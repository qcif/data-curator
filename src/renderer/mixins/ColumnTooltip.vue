<script>
import Tooltip from '../mixins/Tooltip'
export default {
  extends: Tooltip,
  components: {
    'tooltipColumnName': {
      template: '<div class="tooltip-text" id="tooltip-column-name">The <a href="http://specs.frictionlessdata.io/table-schema/#name">Name</a> of the column. Usually the value of the first row in the column.</div>'
    },
    'tooltipColumnTitle': {
      template: '<div id="tooltip-column-title">A human readable <a href="http://specs.frictionlessdata.io/table-schema/#title">Title</a> for the column.</div>'
    },
    'tooltipColumnDescription': {
      template: '<div id="tooltip-column-description">A <a href="http://specs.frictionlessdata.io/table-schema/#description">Description</a> of the column</div>'
    },
    'tooltipColumnType': {
      template: '<div id="tooltip-column-type">Choose a <a href="http://specs.frictionlessdata.io/table-schema/#types-and-formats">Type</a> for the data in the column</div>'
    },
    'tooltipColumnFormat': {
      template: '<div id="tooltip-column-format">Choose the <a href="http://specs.frictionlessdata.io/table-schema/#types-and-formats">Format</a> for the Type of data</div>'
    },
    'tooltipColumnConstraints': {
      template: '<div id="tooltip-column-constraints">Set a <a href="http://specs.frictionlessdata.io/table-schema/#constraints">Constraint</a> to limit valid values</div>'
    },
    'tooltipColumnRdfType': {
      template: '<div id="tooltip-column-rdfType">Set a <a href="http://specs.frictionlessdata.io/table-schema/#rich-types">RDF Type</a> to provide extra meaning to the Type</div>'
    }
  }
}
</script>
<style lang="styl" scoped>
@import '~static/css/panel'
</style>
