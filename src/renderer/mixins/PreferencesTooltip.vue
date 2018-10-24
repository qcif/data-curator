<script>
import Tooltip from '../mixins/Tooltip'
import externalLink from '../partials/ExternalLink'
export default {
  components: {
    externalLink,
    'tooltipPreferencesLicenses': {
      components: { externalLink },
      template: `<div id="tooltip-preferences-licenses">The <externalLink text="Open License" url="http://frictionlessdata.io/specs/data-package/#licenses"/> under which this data package is provided</div>`
    },
    'tooltipPreferencesContributors': {
      components: { externalLink },
      template: `<div id="tooltip-preferences-contributors">Each <externalLink text="Contributor" url="http://frictionlessdata.io/specs/data-package/#contributors"/> must have a title and may contain path, email, role and organization</div>`
    }
  },
  extends: Tooltip
}
</script>
