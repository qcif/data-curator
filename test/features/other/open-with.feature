@backlog

Feature: Open with
  As a user  
  I want to open a data package, separated value file or Excel sheet from the file explorer  
  So that I can quickly start working with the data  
  
  RULES
  =====
  
  - "Open with..." is invoked by right clicking on a file
  
  NOTES
  =====
  
  See
  - [Open With command on data.gov](https://www.data.gov/meta/open-apps)
  -  [Code](https://github.com/GSA/ckanext-datagovtheme/blob/master/ckanext/datagovtheme/templates/package/snippets/resource_item.html)

  Scenario: Open Data Package with Data Curator
    Given I have found a datapackage.zip in the file explorer
    When "Open with..." is invoked
    Then a prompt to open the file using Data Curator is shown
    And "Open Data Curator" should be invoked
    And the selected file should be unzipped
    And each data resource should be opened (from a URL or local) in a new data tab to the right of any other data tabs
    And each data resource header row should be set using the `dialect`
    And the corresponding column, table and package properties should be loaded from datapackage.json into the Properties Panels
    And the provenance information should be loaded from the README.md or README.txt
    And each Data tab should be named using the data resource `name`

  Scenario: Open separated value file with Data Curator
    Given I have found a separated value file in the file explorer
    When "Open with..." is invoked
    Then a prompt to open the file using Data Curator is shown
    And "Open Data Curator" should be invoked
    And the data should be opened in another data tab
    And the tab title should be set to the filename
    And the CSV Dialect `delimiter` should be set based on the file extension, data, and CSV Dialect defaults
    And "Fix Ragged Rows" should be invoked
    And "Freeze Header Row" should be invoked
    And "Guess Column Properties" should be invoked

  Scenario: Open Excel sheet with Data Curator
    Given I have found a Excel file in the file explorer
    When "Open with..." is invoked
    Then a prompt to open the file using Data Curator is shown
    And "Open Data Curator" should be invoked
    And a prompt to select a sheet should be shown 
    And the data should be opened in another data tab
    And the tab title should be set to the filename
    And the CSV Dialect `delimiter` should be set based on the file extension, data, and CSV Dialect defaults
    And "Fix Ragged Rows" should be invoked
    And "Freeze Header Row" should be invoked
    And "Guess Column Properties" should be invoked
