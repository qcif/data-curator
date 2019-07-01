<script>
import Tooltip from '../mixins/Tooltip'
import externalLink from '../partials/ExternalLink'
export default {
  components: {
    externalLink,
    'tooltipProvenanceDescription': {
      components: { externalLink },
      template: `<div id="tooltip-provenance-description">Use text or markdown to provide provenance information in a
      <externalLink text="Readme" url="https://frictionlessdata.io/guides/publish-faq/#readme"/> file in the data package</div>`
    }
  },
  extends: Tooltip
}
</script>
