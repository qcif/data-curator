Feature: Validate Table
  As a Data Packager
  I want to validate the data for common errors and against the schema defined by the column properties
  So that I can correct errors and only share validated data with Data Consumers

  Non-schema data checks include:
  - ragged rows
  - blank header
  - duplicate header
  - duplicate row

  Schema validation checks include the:
  - data is the same 'type' and 'format' as defined in the column properties, ignoring 'missing values'
  - data conforms with the 'contraints'
  - 'foreign key' relationships to one or more columns in:
    - the same table
    - the same data package
    - at table at a url  

  See
  - Validation code https://github.com/frictionlessdata/tableschema-js
  - Foreign key spec http://specs.frictionlessdata.io/table-schema/#foreign-keys
  - Validation errors messages https://github.com/frictionlessdata/data-quality-spec (soon - https://github.com/frictionlessdata/tableschema-js/pull/88#issuecomment-325908863)


  Background:
    Given I have opened Data Curator
    And I have 1 data tab open
    And column properties may have been entered for some or all columns

  Scenario: Validate Table
    When I select "Validate Table" from the menu
    Then assemble the Table Schema from the Column Properties
    And check for non-schema data errors
    And validate the data against the available schema

  Scenario: Validate Table
    When I select "Validate Table" from the toolbar
    Then assemble the Table Schema from the Column Properties
    And check for non-schema data errors
    And validate the data against the available schema
    And display error messages
    And highlight errors in the relevant cells, rows or columns
