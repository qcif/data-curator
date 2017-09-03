Feature: Set Column Properties
  As a Data Packager
  I want to described the meaning and structure of the data
  So that it can be validated and Data Consumers can understand and use it

  Column properties are defined in http://specs.frictionlessdata.io/table-schema/

  The 'name', 'type' and 'format' can be pre-populated using Guess Column Properties

  A 'name' must be entered for each column. 'name' will be defaulted from the value in the first row, unless the CSV Dialect 'header' is 'false'

  The 'title' and 'description' are optional

  Each 'type' has a 'format' of 'default' and may have a limited set of other formats.

  Each column may have a 'constraint' to further restrict the valid values that can be entered into a column. Constrants can vary by 'type'.

  Other properties describe:
    - 'missingValues'
    - 'primaryKeys'
    - 'foreignKeys'

  The user interface would need to accomodate 'foreign key' relationships to columns in:
    - the same table
    - a table in the same data package
    - at table at a url

  Set Column Properties for the current column can be invoked from the menu or toolbar
  Set Column Properties for the next or previous column can be invoked using the next/previous buttons in the Column Properties Panel

  Background:
    Given I have opened Data Curator
    And I have opened a data tab
    Add the cursor is in a column

  Scenario: Set Column Properties for the current column
    When I invoke the "Column Properties" from the menu
    Then display a panel that allows me to properties for the current column
    And accept and validate column property values
    And save the values as they are entered

  Scenario: Use the next button to access Column Properties for the next column
    When I select "Next" from the Column Properties panel
    Then display a panel that allows me to properties for the next column to the right
    And accept and validate column property values
    And save the values as they are entered

  Scenario: Use the previous button to access Column Properties for the previous column
    When I select "Previous" from the Column Properties panel
    Then display a panel that allows me to properties for the next column to the left
    And accept and validate column property values
    And save the values as they are entered
