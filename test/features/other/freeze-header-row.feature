Feature: Toggle Header Row
  As a Data Packager
  I want to freeze the header row (the first row)
  So that the data is not included in "Sort Column" command
  and the header row value may be able to be used to invoke the "Sort Column" command
  and the header row remains visable when the rows are scrolled

  Header Row can be invoked by a checkbox menu item
  By default the menu item is unchecked

  Notes:
  - 'header' = 'true' or 'false' is set in the [CSV Dialect](http://frictionlessdata.io/specs/csv-dialect/#specification) by default
  - 'name' properties are copied from the header row values by "Guess Column Properties" if header row is true
  - 'name' property can be edited based on the header row setting
  - regardless of settings the all the data in the data tab should be saved

  Scenario: Freeze Header Row
    Given I have opened Data Curator
    When I invoke "Header Row"
    Then check the menu item
    And freeze the first row so that is does not scroll
    And use each header row value to invoke "Sort Column"
    And prevent the 'name' column properties from being edited
    And set the 'header' in the CSV Dialect to 'true'

  Scenario: Unfreeze Header Row
    Given I have opened Data Curator
    When I invoke "Header Row"
    Then check the menu item
    And freeze the first row so that is does not scroll
    And use each header row value to invoke "Sort Column"
    And allow the 'name' column properties to be edited
    And set the 'header' in the CSV Dialect to 'false'
