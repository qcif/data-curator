Feature: Guess Column Properties
  As a Data Packager
  I want to derive as many column properties as possible from the data and the CSV dialect
  So that I can quickly set the column properties

  The "Guess Column Properties" command can be invoked using a menu item

  If the 'header' is 'true' in the CSV Dialect, then for each column, set the 'name' property to the value in the first row of the column.
  See:

  http://specs.frictionlessdata.io/table-schema/#name
  http://specs.frictionlessdata.io/csv-dialect/#specification
  Read the first 100 rows of the data and for each column, infer the data type and format and set the 'type' and 'format' property values to the inferred values.

  See: http://specs.frictionlessdata.io/table-schema/#types-and-formats

  If column properties already exist for the guessed properties, then prompt the user to ask if they should be over-written.

  Scenario: Use the menu to Guess column properties
    Given I have opened Data Curator
    And I have opened 1 data tab
    When I invoke the "Guess Column Properties" command
    Then infer the column properties from the data
    And open the Column Properties panel
