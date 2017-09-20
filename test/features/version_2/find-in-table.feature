@backlog

Feature: Find in table
  As a User
  I want to find data within a table
  So that I can determine where in the table it exists


  "Find in table" can be invoked using a toolbar, menu item or keyboard shortcut
  "Find next" and "Find previous" can be invoked using a using a menu item or keyboard shortcut

  Rules:
  - When "find in table" is invoked but no values are found, inform the user
  - When "find next" is invoked but no values are found on reaching the end of the table, inform the user
  - When "find previous" is invoked but no values are found on reaching the start of the table, inform the user

  Notes:
  - https://docs.handsontable.com/0.34.4/demo-searching.html 

  Unresolved:
  - loop through search results regardless of reaching the start/end of the table

  Scenario: Find in table
    Given I have opened Data Curator
    And the cursor is in a data tab
    When I invoke "Find in table"
    Then prompt for a value to find
    And find the next value in the table that matches that value
