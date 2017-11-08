Feature: Toggle Header Row
  As a Data Packager
  I want to freeze the header row (the first row)
  So that the data is not included in "Sort Column" command
  and the header row value may be able to be used to invoke the "Sort Column" command
  and the header row remains visable when the rows are scrolled

  Header Row can be invoked by a checkbox menu item
  By default the menu item is unchecked

  Notes:
  - 'header' = 'true' is set in the CSV Dialect by default
  - 'name' properties are copied from the header row values by "Guess Column Properties"

  Scenario: Freeze Header Row
    Given I have opened Data Curator
    When I invoke "Header Row"
    Then check the menu item
    And freeze the first row so that is does not scroll
    And use each header row value to invoke "Sort Column"

  Scenario: Unfreeze Header Row
    Given I have opened Data Curator
    When I invoke "Header Row"
    Then check the menu item
    And freeze the first row so that is does not scroll
    And use each header row value to invoke "Sort Column"
