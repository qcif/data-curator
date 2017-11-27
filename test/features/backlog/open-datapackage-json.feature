Feature: Open a Data Package Json
  As a User
  I want to open a tabular data package
  So that I can view or edit the data and metadata in the data package

  A [Data package](http://frictionlessdata.io/specs/data-package/) can be represented in a datapackage.json file
  The datapackage.json may be stored:
  - at a URL
  - locally on the computer

  Data Tab Name Rules:
  - The name of a tab should be the 'filename' without the extension
  - The name of a tab that has been described using Table Properties should the the 'name' property
  - the 'name' property takes precidence over the 'filename'

  As part of loading the data in the the data package, If the data has an inconsistent number of columns, fix ragged rows

  Open Data Package Json can be invoked from the Menu

  This feature could be combined with the open datapackage.zip feature

  Notes on opening data packages from CKAN:
  - The current CKAN data package extension only exports a data package with data resources available at a URL i.e. the data is not inside the package

  Scenario: Open a datapackage.json file
    Given I have opened Data Curator
    When I invoke Open Data Package JSON
    Then a prompt, requesting the file name and location or a URL is shown
    But only files ending with a '.json' can be selected
    And each data resource is opened (from URL or local) in a new data tab to the right of any other open data tabs
    And for each data resource "Fix Ragged Rows"
    And for each data resource  "Freeze Header Row" based on the CSV Dialect
    And the corresponding column, table and package properties is loaded from datapackage.json into the Properties Panels
    And the provenance information is loaded from the Readme.md or Readme.txt
    And each Data tab is named according to the rules
