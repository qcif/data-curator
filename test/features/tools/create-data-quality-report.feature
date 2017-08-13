@backlog

Feature: Create Data Quality Report
  As a Data Packager
  I want to share data quality measures
  So that Data Consumers can make informed decisions about using the data

  See:
  - Sample report https://relishapp.com/odi-australia/data-curator/docs/tools/data-quality-report
  - research:
    - https://idl.cs.washington.edu/files/2012-Profiler-AVI.pdf

  Unresolved:
  - prompt user for quality dimensions to include in report
  - how to include report in datapackage.zip (e.g. format, directory structure)
  - allow report before data has been validated? i.e. Assume no:
    - [source issues](https://github.com/frictionlessdata/goodtables-py#validation-against-source-checks) 
    - [structural issues](https://github.com/frictionlessdata/goodtables-py#validation-against-structure-checks)

  Scenario: Create Data Quality Report
    Given I have opened Data Curator
    And I have entered data in 1 or more tables
    When I select "Create Data Quality" from the menu
    Then read all the data
    And the schemas
    And generate a data quality report in a variety of formats (.md, .csv, .json)
