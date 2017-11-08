<script>
import Tooltip from '../mixins/Tooltip'
import externalLink from '../partials/ExternalLink'
export default {
  extends: Tooltip,
  components: {
    externalLink,
    'tooltipProvenanceDescription': {
      components: {externalLink},
      template: `<div id="tooltip-provenance-description">Use text or markdown to provide a
      <externalLink text="Readme" url="http://frictionlessdata.io/guides/publish/faq/#readme"/> for the Data Package.</div>`
    }
  }
}
</script>
