Feature: Open a Data Package
  As a User
  I want to open a tabular data package
  So that I can view or edit the data and metadata in the data package

  A Data package is typically stored in a file called datapackage.zip
  The data resources in the package can be stored:
  - at a URL
  - locally within the package

  Notes:
  - The current CKAN data package extension only exports a data package with data resources available at a URL i.e. the data is not inside the package
  - The current CKAN data package extension does not support version 1.0 of the Frictionless Data specification.
  - Data Curator only supports version 1.0 of the Frictionless Data specification.
  - To enable Data Curator and data.qld.gov.au to interoperate using Data Packages:
    - the CKAN data package extension must be upgraded to support version 1.0 of the Frictionless Data specification.
    - the upgraded CKAN data package extension must be installed on data.qld.gov.au
  - Resources:
    - Extension: https://github.com/ckan/ckanext-datapackager
    - CSV at URL: https://github.com/ckan/ckanext-datapackager/issues/52
    - v1.0 specification not supported: https://github.com/ckan/ckanext-datapackager/pull/54
    - Discussion: https://gitter.im/frictionlessdata/chat?at=59aba377b16f264642fdd8df
    - Estimate to fix extension: https://gitter.im/frictionlessdata/chat?at=59abab1ec101bc4e3a84f46f
  - Alternatives:
    - explore when ready https://github.com/frictionlessdata/ckanext-validation/issues/12

  Frictionless Data specification:
  - http://specs.frictionlessdata.io/data-package/
  - http://specs.frictionlessdata.io/tabular-data-package/

  Data Tab Name Rules:
  - The name of a tab should be the 'filename' without the extension
  - The name of a tab that has been described using Table Properties should the the 'name' property
  - the 'name' property takes precidence over the 'filename'

  Open Data Package can be invoked from the Menu

  Scenario: Open a data package
    Given I have opened Data Curator
    When I invoke "Open Data Package"
    Then a prompt, requesting the file name and location is shown
    But only files ending with a '.zip' can be selected
    And the selected file is unzipped
    And each data resource is opened (from URL or local) in a new data tab to the right of any other open data tabs
    And the corresponding column, table and package properties is loaded from datapackage.json into the Properties Panels
    And the provenance information is loaded from the Readme.md or Readme.txt
    And each Data tab is named according to the rules
