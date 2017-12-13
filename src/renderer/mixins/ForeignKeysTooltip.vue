<script>
import Tooltip from '../mixins/Tooltip'
import externalLink from '../partials/ExternalLink'
export default {
  extends: Tooltip,
  components: {
    externalLink,
    'tooltipForeignkey': {
      components: {externalLink},
      template: `<div id="tooltip-foreignkey">A
      <externalLink text="Foreign Key" url="http://frictionlessdata.io/specs/table-schema/#foreign-keys"/> must exist in the referenced table and column(s)</div>`
    },
    'tooltipForeignkeyTable': {
      components: {externalLink},
      template: `<div id="tooltip-foreignkey-table">The table used to reference the foreign key(s).</div>`
    },
    'tooltipForeignkeyTablekey': {
      components: {externalLink},
      template: `<div id="tooltip-foreignkey-tablekey">The table columnn header(s) used to reference the foreign key(s).</div>`
    }
  }
}
</script>
