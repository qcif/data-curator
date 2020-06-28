@backlog @draft

Feature: Data Quality Information
  As a Data Packager
  I want to share data quality measures
  So that Data Consumers can make informed decisions about using the data

  The "Data Quality Information" command can be invoked using a menu item

  See:
  - [Sample report](https://github.com/qcif/data-curator/blob/master/test/features/backlog/sample-data-quality-information.md)
  - [GoodTables.py conversation](https://gitter.im/frictionlessdata/chat?at=5a4791515355812e57324073)

  - research:

    - https://idl.cs.washington.edu/files/2012-Profiler-AVI.pdf

  QUESTIONS
  =========

    - prompt user for quality dimensions to include in report
    - how to include report in datapackage.zip (e.g. format, directory structure, in readme?)
    - allow report before data has been validated? i.e. Assume no:
      - [source issues](https://github.com/frictionlessdata/goodtables-py#validation-against-source-checks)
      - [structural issues](https://github.com/frictionlessdata/goodtables-py#validation-against-structure-checks)

  Scenario: Data Quality Information
    Given Data Curator is open
    And data is entered in one or more tables
    When "Data Quality Information" is invoked
    Then read all the data
    And the schemas
    And generate a data quality data in a variety of formats (.md, .csv, .json)
