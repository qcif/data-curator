<script>
import Tooltip from '../mixins/Tooltip'
import externalLink from '../partials/ExternalLink'
export default {
  extends: Tooltip,
  components: {
    externalLink,
    'tooltipPackageName': {
      components: {externalLink},
      template: `<div id="tooltip-package-name">The
      <externalLink text="Name" url="http://frictionlessdata.io/specs/data-package/#name/> of the data package. Lower case, numbers, ".", "_", "-" characters only</div>`
    },
    'tooltipPackageId': {
      components: {externalLink},
      template: `<div id="tooltip-package-id">A globally unique identifier (
      <externalLink text="Id" url="http://frictionlessdata.io/specs/data-package/#id"/>)</div>`
    },
    'tooltipPackageTitle': {
      components: {externalLink},
      template: `<div id="tooltip-package-title">The
      <externalLink text="Title" url="http://frictionlessdata.io/specs/data-package/#title"/> or one sentence description for this data package</div>`
    },
    'tooltipPackageDescription': {
      components: {externalLink},
      template: `<div id="tooltip-package-description">A
      <externalLink text="Description" url="http://frictionlessdata.io/specs/data-package/#description"/> for the data package</div>`
    },
    'tooltipPackageVersion': {
      components: {externalLink},
      template: `<div id="tooltip-package-version">A data package
      <externalLink text="version" url="http://frictionlessdata.io/specs/patterns/#data-package-version> follows the Semantic Versioning specification format</div>`
    },
    'tooltipPackageSources': {
      components: {externalLink},
      template: `<div id="tooltip-package-sources">Each
      <externalLink text="Source" url="http://frictionlessdata.io/specs/data-package/#sources"/> MUST have a title and MAY have path and/or email address</div>`
    },
    'tooltipPackageLicences': {
      components: {externalLink},
      template: `<div id="tooltip-package-licences">The
      <externalLink text="Open License" url="http://frictionlessdata.io/specs/data-package/#licenses"/> under which the data package is provided</div>`
    }
  }
}
</script>
