Feature: Insert Row Below
  As a Data Packager
  I want to insert another row below the current row
  So that I can add more data to the data tab

  RULES
  =====

  - The "Insert Row Below" command can be invoked using a menu item, keyboard shortcut or a context menu in the data tab

  @impl
  Scenario: Insert Row Below
    Given Data Curator is open
    And the table has 1 row by 3 columns
    When the user clicks in row 1, column 1
    And the user right-clicks
    And the user clicks on "Insert Row Below"
    Then the table should have 2 rows by 3 columns
    And there should be 1 new row below the current row
    And there should be 3 columns
    And the cursor should be in row 2, column 1
