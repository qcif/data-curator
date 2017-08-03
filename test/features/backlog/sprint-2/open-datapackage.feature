@backlog @sprint-2

Feature: Open a Data Package
  As a Data Packager or Data Consumer
  I want to open a tabular data package
  So that I can view or edit the data or metadata in the data package

  A Data package is typically stored in a file called datapackage.zip

  See:
  http://specs.frictionlessdata.io/data-package/
  http://specs.frictionlessdata.io/tabular-data-package/

  Unresolved:
  - can a data package be opened when data package properties are present? If so which data package properties take precidence? 

  Scenario: Use the menu to open a data package file
    Given I have opened Data Curator
    When I select Open, Data Package from the menu
    Then a prompt, requesting the file name and location is shown
    But only files ending with a '.zip' can be selected
    Then the selected file is unzipped
    And each data file is opened in a new data tab to the right of any other open data tabs
    And the corresponding column, table and package properties and the provenance information is loaded
