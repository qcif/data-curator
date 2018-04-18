Feature: Open a Data Package
  As a User  
  I want to open a tabular data package  
  So that I can view or edit the data, metadata and provenance information in the data package  

  RULES
  =====

  - [Tabular data packages](https://frictionlessdata.io/specs/tabular-data-package/) can be opened from a URL or local path
  - A tabular data package can be stored in `.zip` or `.json` format
  - The `datapackage.zip` typically contains:
    - [tabular data resources](https://frictionlessdata.io/specs/tabular-data-resource/) (e.g. one or more `.csv` files located via a local path or url reference)
      - JSON Tabular Data is not supported
    - a datapackage.json file (that describes the data package and contains a [table schema](http://frictionlessdata.io/specs/table-schema/) and may contain a [CSV dialect](http://frictionlessdata.io/specs/csv-dialect/) for each resource)
      - the `schema` and `dialect` for each resource may be in-line or referenced via a url 
    - a `README.md` file (containing the provenance information)
  - The datapackage.json file not in a zip file:
    - references the tabular data resources via a url 
    - describes the tabular data package and contains the `schema` and `dialect` for each resource, either inline or referenced via a url
    - doesn't include or reference and README.md or README.txt
  - "Open Data Package" can be invoked from the Menu
  
  LATER
  =====
  
  - Open a data package that references a Table Schema at a URL 
  - Open a data package that references a CSV Dialect at a URL
  
  QUESTIONS
  =========
  
  - What properties could be lost on opening a valid tabular data package?
    - data package:
      - homepage
      - image
      - keywords
      - created
    - data resource:
      - data
      - hash
      - bytes 
    - dialect: (this may result in invalid results)
      - quoteChar 
      - doubleQuote
      - escapeChar
      - nullSequence
      - skipInitialSpace
      - csvddfVersion 
    - [pattern properties](https://frictionlessdata.io/specs/patterns) except `package` in the [Table Schema: Foreign Keys to Data Packages pattern](https://frictionlessdata.io/specs/patterns/#table-schema:-foreign-keys-to-data-packages)
    
  Scenario: Open a data package 
    Given Data Curator is open
    When "Open Data Package" is invoked
    And a data package file <location> is selected
    Then the properties from datapackage.json and internal URL references should be loaded into the property panels
    And each data resource (at a URL or path) should be opened in a new data tab to the right of any other open data tabs
    And each Data tab should be named using the data resource `name`
    And each data resource header row should be set using the `dialect`  
    And text in any associated README.md or README.txt should be loaded into the provenance information

  Scenario: Open a valid datapackage.json from URL
    Given Data Curator is open
    And a valid datapackage.json file is stored at a URL
    When "Open Data Package" is invoked
    And the datapackage.json file at the URL is specified
    Then the properties from datapackage.json should be displayed in the property panels
    And the data at the `path` of each data resource should open in a new data tab to the right of any other open data tabs
    And each Data tab should be named using the data resource `name`
    And each data resource header row should be set using the `dialect`  
  
    Examples:
      | location                                                                                                          | notes                                                                   |
      | https://raw.githubusercontent.com/frictionlessdata/example-data-packages/master/cpi-data-via-url/datapackage.json | datapackage.json at url, data at url, schema and dialect in-line               |

  Scenario: Open an invalid datapackage.json from URL
    Given Data Curator is open
    And an invalid datapackage.json file is stored at a URL
    When "Open Data Package" is invoked
    And the datapackage.json file at the URL is specified
    Then an error should be displayed 
  
  Scenario: Open datapackage.json from URL with properties unsupported by Data Curator
    Given Data Curator is open
    And a valid datapackage.json file is stored at a URL
    When "Open Data Package" is invoked
    And the datapackage.json file at the URL is specified
    Then the properties from datapackage.json should be displayed in the property panels
    And the data at the `path` of each data resource should open in a new data tab to the right of any other open data tabs
    And each Data tab should be named using the data resource `name`
    And each data resource header row should be set using the `dialect`
    And a warning should be displayed stating that some unsupported properties were not imported  

    Examples:
      | location                                                                                                                  | notes                                                      |
      | https://raw.githubusercontent.com/frictionlessdata/example-data-packages/master/iso-639-1-language-codes/datapackage.json | This data package implements the Language support pattern. |

  Scenario: Open a valid datapackage.zip 
    Given Data Curator is open
    And a valid datapackage.zip file is stored at a URL or local file
    When "Open Data Package" is invoked
    And the datapackage.zip file is specified
    Then the properties from datapackage.json file should be displayed in the property panels
    And the data at the `path` of each data resource should open in a new data tab to the right of any other open data tabs
    And each Data tab should be named using the data resource `name`
    And each data resource header row should be set using the `dialect`
    And the README.md should be displayed in the provenance information panel  

    Examples:
      | location                                                                                                          | notes                                                                   |
      | cpi.zip                                                                                                           | local datapackage.zip file, data in package, schema and dialect in-line |
      | https://github.com/frictionlessdata/example-data-packages/raw/master/zip/cpi.zip                                  | datapackage.zip at url, data in package, schema and dialect in-line            |
      | https://github.com/frictionlessdata/example-data-packages/raw/master/zip/donation-codes-via-url.zip               | datapackage.zip at url, data, schema and dialect at url                        |
