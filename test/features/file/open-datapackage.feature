Feature: Open a Data Package
  As a User  
  I want to open a tabular data package  
  So that I can view or edit the data, metadata and provenance information in the data package  

  RULES
  =====

  - data package files can be opened from a URL or local path
  - A [data package](http://frictionlessdata.io/specs/data-package/) can be stored in `.zip` or `.json` format.
  - The `datapackage.zip` typically contains:
    - The data resources (e.g. one or more `.csv` files or url references)
    - a datapackage.json file (that contains a schema and dialect for each resource)
    - a `README.md` file (containing the provenance information)
  - The datapackage.json:
    - contains the `.csv` data resources via a url reference
    - the schema and dialect for each resource either inline or via a url reference
    - doesn't contain the `README.md` (however this may have been converted a json property that is not defined in the Frictionless Data specification)
  - "Open Data Package" can be invoked from the Menu
  
  LATER
  =====
  
  - Open data package from url
  - Open data using url reference

  Scenario: Open a data package zip
    Given Data Curator is open
    When "Open Data Package" is invoked
    And a .zip file is selected
    Then the selected file should be unzipped
    And each data resource should be opened (from a URL or local) in a new data tab to the right of any other open data tabs
    And each data resource header row should be set using the `dialect`
    And the corresponding column, table and package properties should be loaded from datapackage.json into the Properties Panels
    And the provenance information should be loaded from the README.md or README.txt
    And each Data tab should be named using the data resource `name`

  Scenario: Open a data package json
    Given Data Curator is open
    When "Open Data Package" is invoked
    And a .json file is selected
    Then each data resource should be opened (from a URL or local) in a new data tab to the right of any other open data tabs
    And for each data resource header row should be set using the `dialect`
    And the corresponding column, table and package properties should be loaded from datapackage.json into the Properties Panels
    And each Data tab should be named using the data resource `name`
