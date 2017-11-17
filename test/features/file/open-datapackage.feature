Feature: Open a Data Package Zip
  As a User
  I want to open a tabular data package
  So that I can view or edit the data and metadata in the data package

  A [Data package](http://frictionlessdata.io/specs/data-package/) is typically stored in a file called datapackage.zip
  The data resources in the package can be stored:
  - at a URL
  - locally within the package

  Data Tab Name Rules:
  - The name of a tab should be the 'filename' without the extension
  - The name of a tab that has been described using Table Properties should the the 'name' property
  - the 'name' property takes precidence over the 'filename'

  As part of loading the data in the the data package, If the data has an inconsistent number of columns, fix ragged rows

  Open Data Package can be invoked from the Menu

  Notes on opening data packages from CKAN:
  - The current CKAN data package extension only exports a data package with data resources available at a URL i.e. the data is not inside the package
  - Data Packages may be provided as .json not .zip files depending on implementation

  Scenario: Open a data package
    Given I have opened Data Curator
    When I invoke "Open Data Package"
    Then a prompt, requesting the file name and location is shown
    But only files ending with a '.zip' can be selected
    And the selected file is unzipped
    And each data resource is opened (from URL or local) in a new data tab to the right of any other open data tabs
    And for each data resource "Fix Ragged Rows"
    And for each data resource  "Freeze Header Row"
    And the corresponding column, table and package properties is loaded from datapackage.json into the Properties Panels
    And the provenance information is loaded from the Readme.md or Readme.txt
    And each Data tab is named according to the rules
