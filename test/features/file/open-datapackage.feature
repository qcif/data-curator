Feature: Open a Data Package
  As a User
  I want to open a tabular data package
  So that I can view or edit the data and metadata in the data package

  A Data package is typically stored in a file called datapackage.zip

  See:
  http://specs.frictionlessdata.io/data-package/
  http://specs.frictionlessdata.io/tabular-data-package/

  Rules:
  - The name of a tab should be the 'filename' without the extension
  - The name of a tab that has been described using Table Properties should the the 'name' property
  - the 'name' property takes precidence over the 'filename'

  Scenario: Use the menu to open a data package file
    Given I have opened Data Curator
    When I select Open, Data Package from the menu
    Then a prompt, requesting the file name and location is shown
    But only files ending with a '.zip' can be selected
    And the selected file is unzipped
    And each data file is opened in a new data tab to the right of any other open data tabs
    And the corresponding column, table and package properties and the provenance information is loaded
    And each tab is named according to the rules
