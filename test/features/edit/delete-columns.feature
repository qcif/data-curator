Feature: Remove Columns
  As a Data Packager
  I want to delete one or more columns
  So that I can only share the data that is appropriate to share

  RULES
  =====

    - One column can be deleted based on the location of the cursor in the table
    - One or more columns can be deleted by selecting a number of columns
    - If the a column is deleted, move the cursor to the next column
    - If the last column is deleted, instead moving the cursor to the next column, move the cursor to the previous column
    - When a column is deleted, leave the cursor in the same row
    - The "Remove Column(s)" command can be invoked using a menu item or keyboard shortcut

  Scenario: Remove Column(s)
    Given a column(s) is selected
    When "Remove Column(s)" is invoked
    Then delete the selected column(s)
    And move the cursor to the required position in the table
