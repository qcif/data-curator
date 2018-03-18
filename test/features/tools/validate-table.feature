Feature: Validate Table
  As a Data Packager
  I want to validate the data for common errors and against the schema defined by the column properties
  So that I can correct errors and share validated data with Data Consumers

  The "Validate Table" command can be invoked using a menu item, toolbar button or keyboard shortcut

  [Structural data checks](https://github.com/frictionlessdata/goodtables-py#validation-against-structure-checks) include:
  - blank header
  - duplicate header
  - blank row
  - duplicate row
  - ragged rows (extra/missing value compared to header row)

  Schema validation checks include the:
  - data is the same 'type' and 'format' as defined in the column properties, ignoring 'missing values'
  - data conforms with the 'constraints'
  - 'foreign key' relationships to one or more columns in:
    - the same table
    - the same data package
    - at table at a url  (not in specification [yet](https://gitter.im/frictionlessdata/chat?at=59eaed08f7299e8f53142845))

  See
  - [Validation code](https://github.com/frictionlessdata/tableschema-js)
  - [Foreign key spec](http://frictionlessdata.io/specs/table-schema/#foreign-keys)
  - [Validation errors messages](https://github.com/frictionlessdata/data-quality-spec)
  - [GoodTables.py](https://github.com/frictionlessdata/goodtables-py) implementation

  Scenario: Validate Table
    Given I have opened Data Curator
    And I have 1 data tab open
    And column properties may have been entered for some or all columns
    When I invoke the "Validate Table" command
    Then assemble the Table Schema if avaliable from Column Properties
    And check for structural data errors
    And validate the data against the available schema
    And display error messages
    And highlight errors in the relevant cells, rows or columns

  Scenario: Pop out validation error messages
    Given I have Validated a Table
    And errors have been detected and displayed
    When I invoke the "Pop out validation error messages" command
    Then display the error messages in a table in a separate window
    Add show a count of the number of errors detected

  Scenario: Sort validation error messages
    Given I have Validated a Table
    And errors have been detected and displayed error messages in a table in a separate window
    When I invoke the sort column command
    Then sort the error messages by that columns

  Scenario: Filter validation error messages
    Given I have Validated a Table
    And errors have been detected and displayed error messages in a table in a separate window
    When I invoke the filter column command
    And provide a filter value(s)
    Then only display the error messages that meet the filter criteria

  Scenario: Link to error cell
    Given I have Validated a Table
    And errors have been detected and displayed
    When I click the error message
    Then move the cursor to the associated cell in table

  Scenario: Write residual error to provenance information
    Given I have Validated a Table
    And errors have been detected and displayed error messages in a table in a separate window
    When I invoke the "write errors to provenance information" command
    Then append a heading "### Known Data Errors" to the end of the provenance information
    And append a paragraph "This data is published with the following {count} data errors. Other errors may be present and could be detected after these errors are resolved." to the end of the provenance information
    And append each error message as a bullet item to the end of the provenance information
