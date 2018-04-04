Feature: Open a Data Package
  As a User  
  I want to open a tabular data package  
  So that I can view or edit the data, metadata and provenance information in the data package  

  RULES
  =====

  - Data packages can be opened from a URL or local path
  - A [data package](http://frictionlessdata.io/specs/data-package/) can be stored in `.zip` or `.json` format.
  - The `datapackage.zip` typically contains:
    - The data resources (e.g. one or more `.csv` files located via a local path or url reference)
    - a datapackage.json file (that contains a schema and dialect for each resource)
      - the `schema` and/or `dialect` for each resource may be in-line or referenced via a url - [test data](https://github.com/frictionlessdata/example-data-packages/raw/master/zip/donation-codes-via-url.zip)
    - a `README.md` file (containing the provenance information)
  - The datapackage.json:
    - references the `.csv` data resources via a url reference 
    - contains the `schema` and `dialect` for each resource inline or referenced via a url - [test data](https://raw.githubusercontent.com/frictionlessdata/example-data-packages/master/donation-codes-via-url/datapackage.json)
    - doesn't contain the `README.md` (however this may have been converted a json property that is not defined in the Frictionless Data specification)
  - "Open Data Package" can be invoked from the Menu
  
  LATER
  =====
  
  - Open a data package that references a Table Schema at a URL 
  - Open a data package that references a CSV Dialect at a URL

  Scenario Outline: Open a data package 
    Given Data Curator is open
    When "Open Data Package" is invoked
    And a data package file <location> is selected
    Then the properties from datapackage.json and URL references should be loaded into the property panels
    And each data resource (at a URL or path) should be opened in a new data tab to the right of any other open data tabs
    And each Data tab should be named using the data resource `name`
    And each data resource header row should be set using the `dialect`  
    And text in any associated README.md or README.txt should be loaded into the provenance information

    Examples:
      | location                                                                                                          | notes                                                                   |
      | cpi.zip                                                                                                           | local datapackage.zip file, data in package, schema and dialect in-line |
      | https://github.com/frictionlessdata/example-data-packages/raw/master/zip/cpi.zip                                  | datapackage.zip at url, data in package, schema and dialect in-line            |
      | https://raw.githubusercontent.com/frictionlessdata/example-data-packages/master/cpi-data-via-url/datapackage.json | datapackage.json at url, data at url, schema and dialect in-line               |
      | https://github.com/frictionlessdata/example-data-packages/raw/master/zip/donation-codes-via-url.zip               | datapackage.zip at url, data, schema and dialect at url                        |
