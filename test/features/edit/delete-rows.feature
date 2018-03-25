Feature: Remove Rows
  As a Data Packager
  I want to delete one or more rows
  So that I can only share the data that is appropriate to share

  Rules:
    - One row can be deleted based on the location of the cursor in the table
    - One or more rows can be deleted by selecting a number of rows
    - If the a row is deleted, move the cursor to the next row
    - If the last row is deleted, instead moving the cursor to the next row, move the cursor to the previous column
    - When a row is deleted, leave the cursor in the same column
    - The "Remove Row(s)" command can be invoked using a menu item or keyboard shortcut

  Scenario: Remove Row(s)
    Given I have selected the row(s) to be deleted
    When I invoke the "Remove Row(s)" command
    Then delete the selected row(s)
    And move the cursor to the required position in the table
