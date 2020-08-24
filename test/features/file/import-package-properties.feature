Feature: Import Package Properties
  As a User
  I want to import package properties
  So that I can view or edit the metadata and provenance information in the data package
  And use my existing table(s) data

  RULES
  =====

  - [Tabular data packages](https://frictionlessdata.io/specs/tabular-data-package/) can be opened from a URL or local path
  - A tabular data package json file must be in `.json` format
  - The datapackage.json file describes the data package and contains a [table schema](http://frictionlessdata.io/specs/table-schema/) and may contain a [CSV dialect](http://frictionlessdata.io/specs/csv-dialect/) for each resource), either inline or referenced via a url
  - the `schema` and `dialect` for each resource may be in-line or referenced via a url

  Scenario: Open a valid datapackage.json URL
    Given Data Curator is open
    When "Import Package Properties" is invoked
    And a valid json datapackage.json URL is used
    Then an error message should be displayed