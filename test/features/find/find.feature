Feature: Find data
  As a User
  I want to find data within the current column or across the current table
  So that I can determine if the data exists and correct it if necessary

  Rules:
  - Users can choose to find across the table or within the current column
  - The default search constraint is find in table
  - When a search is performed and no values are found, inform the user
  - When "Find next" is invoked but no values are found on reaching the end of the column/table, inform the user
  - When "Find previous" is invoked but no values are found on reaching the start of the column/table, inform the user
  - "Find" can be invoked using a toolbar, menu item or keyboard shortcut
  - "Find next" and "Find previous" can be invoked using a using a menu item, button or keyboard shortcut

  Notes:
  - https://docs.handsontable.com/0.34.4/demo-searching.html

  Scenario: Find next
    Given Data Curator is open
    And provided a value to find and optionally search constraints
    When "Find next" is invoked
    Then find the next value after the current active cell that matches that value and within the search constraints
    And highlight the found value

  Scenario: Find previous
    Given Data Curator is open
    And provided a value to find for and search constraints
    When "Find previous" is invoked
    Then find the previous value before the current active cell that matches that value and within the search constraints
    And highlight the found value
