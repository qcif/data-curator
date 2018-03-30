@backlog

Feature: Open with
  As a user  
  I want to open a data package from the file explorer  
  So that I can quickly start working with the data  
  
  RULES
  
  - "Open with..." is invoked by right clicking on a file
  
  NOTES
  =====
  
  See
  - [Open With command on data.gov](https://www.data.gov/meta/open-apps)
  -  [Code](https://github.com/GSA/ckanext-datagovtheme/blob/master/ckanext/datagovtheme/templates/package/snippets/resource_item.html)

  Scenario: Open with Data Curator
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
