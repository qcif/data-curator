@backlog

Feature: Find in column
  As a User
  I want to find data within a specific column
  So that I can determine where in the column it exists

  "Find in column" can be invoked using a toolbar, menu item or keyboard shortcut
  "Find next" and "Find previous" can be invoked using a using a menu item or keyboard shortcut

  Rules:
  - When "find in column" is invoked but no values are found, inform the user
  - When "find next" is invoked but no values are found on reaching the end of the column, inform the user
  - When "find previous" is invoked but no values are found on reaching the start of the column, inform the user

  Unresolved:
  - loop through search results regardless of reaching the start/end of the column
  - user interface

  Scenario: Find in column
    Given I have opened Data Curator
    And the cursor is in a column
    When I invoke "Find in column"
    Then prompt for a value to find
    And find the next value in the column that matches that value

  Scenario: Find next in column
    Given I have found a value in a column using "Find in column"
    When I invoke "Find next"
    Then find the next value in the column that matches that value

  Scenario: Find previous in column
    Given I have found a value in a column using "Find in column"
    When I invoke "Find previous"
    Then find the previous value in the column that matches that value
