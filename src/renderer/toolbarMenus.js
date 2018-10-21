const toolbarMenus = [{
  name: 'Guess',
  id: 'guess-column-properties',
  image: 'static/img/guess-column-properties.svg',
  tooltipId: 'tooltip-guess',
  tooltipView: 'tooltipGuess'
},
{
  name: 'Column',
  id: 'column-properties',
  image: 'static/img/column-properties.svg',
  tooltipId: 'tooltip-column',
  tooltipView: 'tooltipColumn',
  sideNavPosition: 'right',
  sideNavView: 'column'
},
{
  name: 'Table',
  id: 'table-properties',
  image: 'static/img/table-properties.svg',
  tooltipId: 'tooltip-table',
  tooltipView: 'tooltipTable',
  sideNavPosition: 'right',
  sideNavView: 'tabular'
},
{
  name: 'Provenance',
  id: 'provenance-information',
  image: 'static/img/provenance-information.svg',
  tooltipId: 'tooltip-provenance',
  tooltipView: 'tooltipProvenance',
  sideNavPosition: 'right',
  sideNavView: 'provenance'
},
{
  name: 'Package',
  id: 'data-package-properties',
  image: 'static/img/data-package-properties.svg',
  tooltipId: 'tooltip-package',
  tooltipView: 'tooltipPackage',
  sideNavPosition: 'right',
  sideNavView: 'packager'
},
{
  name: 'Validate',
  id: 'validate-data',
  image: 'static/img/validate.svg',
  tooltipId: 'tooltip-validate',
  tooltipView: 'tooltipValidate'
},
{
  name: 'Find and Replace',
  id: 'findReplace',
  image: 'static/img/find.svg',
  tooltipId: 'tooltip-find',
  tooltipView: 'tooltipFind',
  sideNavPosition: 'left',
  sideNavView: 'findReplace'
},
{
  name: 'Export',
  id: 'export-package',
  image: 'static/img/export.svg',
  tooltipId: 'tooltip-export',
  tooltipView: 'tooltipExport',
  sideNavView: 'export'
}]

export {
  toolbarMenus
}
