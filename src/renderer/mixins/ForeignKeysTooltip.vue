<script>
import Tooltip from '../mixins/Tooltip'
import externalLink from '../partials/ExternalLink'
export default {
  components: {
    externalLink,
    'tooltipForeignkey': {
      components: { externalLink },
      props: ['index'],
      template: `<div :id="'tooltip-foreignkey' + index">A
      <externalLink text="Foreign Key" url="http://frictionlessdata.io/specs/table-schema/#foreign-keys"/> must exist in the referenced table and column(s)</div>`
    },
    'tooltipForeignkeyTable': {
      components: { externalLink },
      props: ['index'],
      template: `<div :id="'tooltip-foreignkey-table' + index">The table used to reference the foreign key(s).</div>`
    },
    'tooltipForeignkeyTablekey': {
      components: { externalLink },
      props: ['index'],
      template: `<div :id="'tooltip-foreignkey-tablekey' + index">The table columnn header(s) used to reference the foreign key(s).</div>`
    }
  },
  extends: Tooltip
}
</script>
