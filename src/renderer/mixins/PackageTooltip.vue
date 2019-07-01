<script>
import Tooltip from '../mixins/Tooltip'
import externalLink from '../partials/ExternalLink'
export default {
  components: {
    externalLink,
    'tooltipPackageName': {
      components: { externalLink },
      template: `<div id="tooltip-package-name">The
      <externalLink text="Name" url="http://frictionlessdata.io/specs/data-package/#name"/> of this data package. Lower case, numbers, ".", "_", "-" characters only</div>`
    },
    'tooltipPackageId': {
      components: { externalLink },
      template: `<div id="tooltip-package-id">A globally unique (<externalLink text="identifier" url="http://frictionlessdata.io/specs/data-package/#id"/>) for this data package</div>`
    },
    'tooltipPackageTitle': {
      components: { externalLink },
      template: `<div id="tooltip-package-title">The <externalLink text="Title" url="http://frictionlessdata.io/specs/data-package/#title"/> a one sentence description for this  data package</div>`
    },
    'tooltipPackageDescription': {
      components: { externalLink },
      template: `<div id="tooltip-package-description">A <externalLink text="Description" url="http://frictionlessdata.io/specs/data-package/#description"/> for this data package</div>`
    },
    'tooltipPackageVersion': {
      components: { externalLink },
      template: `<div id="tooltip-package-version">A <externalLink text="Version" url="http://frictionlessdata.io/specs/patterns/#data-package-version"/> number e.g. 1.0.0</div>`
    },
    'tooltipPackageSources': {
      components: { externalLink },
      template: `<div id="tooltip-package-sources">Each <externalLink text="Source" url="http://frictionlessdata.io/specs/data-package/#sources"/> must have a title and may have path and/or email</div>`
    },
    'tooltipPackageLicenses': {
      components: { externalLink },
      template: `<div id="tooltip-package-licenses">The <externalLink text="Open License" url="http://frictionlessdata.io/specs/data-package/#licenses"/> under which this data package is provided</div>`
    },
    'tooltipPackageContributors': {
      components: { externalLink },
      template: `<div id="tooltip-package-contributors">Each <externalLink text="Contributor" url="http://frictionlessdata.io/specs/data-package/#contributors"/> must have a title and may contain path, email, role and organization</div>`
    }
  },
  extends: Tooltip
}
</script>
