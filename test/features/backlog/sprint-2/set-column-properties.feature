@backlog @sprint-2

Feature: Set column properties
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

# show / hide in menu    

  Background:
    Given I have opened Data Curator
    And I have opened a data tab
    And the cursor is in a column

  Scenario: Use the menu to access Column Properties for the current column
    When I select "Column Properties" from the menu
    Then display a panel that allows me to properties for the current column
    And accept and validate column property values
    And save the values as they are entered

  Scenario: Use the toolbar access Column Properties for the current column
    When I select "Column Properties" from the toolbar
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
