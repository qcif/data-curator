Feature: Validate Table
  As a Data Packager  
  I want to validate the data for common errors and against the [schema](https://frictionlessdata.io/specs/table-schema/) I have defined  
  So that I can correct errors and share validated data with Data Consumers  

  RULES
  =====

    - The "Validate Table" command can be invoked using a menu item, toolbar button or shortcut
    - [Structural data checks](https://github.com/frictionlessdata/goodtables-py#validation-against-structure-checks) include:
      - blank header
      - duplicate header
      - blank row
      - duplicate row
      - ragged rows (extra/missing value compared to header row)
    - Schema validation checks include the:
      - data is the same "type" and "format" as defined in the schema, ignoring "missing values"
      - data conforms with the "constraints"
      - "primary keys" are unique
      - "foreign key" relationships to one or more columns in:
        - the same table
        - another table in the same data package
        - another table in a data package at a url (not in specification [yet](https://gitter.im/frictionlessdata/chat?at=59eaed08f7299e8f53142845))

  Scenario: Validate Table
    Given Data Curator is open
    And a data tab is open
    And column properties may have been entered for some or all columns
    When "Validate Table" is invoked
    Then assemble the Table Schema if avaliable from Column Properties
    And validate the data for structural data errors
    And validate the data against the schema
    And display error messages in a panel
    And highlight errors in the relevant cells, rows or columns

  Scenario: Pop out validation error messages
    Given Data Curator is open
    And data in a table has been validated
    And errors have been detected and displayed in a panel
    When "Pop out validation error messages" is invoked
    Then display the error messages in a table in a separate window
    And show a count of the number of errors detected
    And close the error message panel

  Scenario: Sort validation error messages
    Given data in a table has been validated
    And errors have been detected and displayed error messages in a table in a separate window
    When "sort column" is invoked 
    Then sort the error messages by that columns

  Scenario: Filter validation error messages
    Given data in a table has been validated
    And errors have been detected and displayed error messages in a table in a separate window
    When "filter column" is invoked
    And provide a filter value(s)
    Then only display the error messages that meet the filter criteria

  Scenario: Link to error cell
    Given data in a table has been validated
    And errors have been detected and displayed
    When an error message is selected
    Then move the cursor to the associated cell in table

  Scenario: Write residual errors to provenance information
    Given data in a table has been validated
    And errors have been detected and displayed error messages in a table in a separate window
    When "write errors to provenance information" is invoked
    Then append a heading "### Known Data Errors" to the end of the provenance information
    And append a paragraph "This data is published with the following data errors. Other errors may be present and could be detected after these errors are resolved." to the end of the provenance information
    And append each error message as a numbered bullet item to the end of the provenance information
