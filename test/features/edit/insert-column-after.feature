Feature: Insert Column After
  As a Data Packager
  I want to insert another column after the current column
  So that I can add more data to the data table

  RULES
  =====

  - The "Insert Column After" command can be invoked using a menu item, keyboard shortcut or a context menu in the data tab

  @impl
  Scenario: Insert Column After
    Given Data Curator is open
    And the table should have 1 row by 3 columns
    And the active table has data: "[["test","",""]]"
    When the user clicks in row 1, column 3
    And the user right-clicks
    And the user clicks on "Insert Column After"
    Then the table should have 1 row by 4 columns
    And there should be 1 new column after the current column
    And there should be 1 row
