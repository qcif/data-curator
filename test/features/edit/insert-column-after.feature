Feature: Insert Column After
  As a Data Packager
  I want to insert another column after the current column
  So that I can add more data to the data table

  Rules
  =====

    - The "Insert Column After" command can be invoked using a menu item or keyboard shortcut

  Scenario: Insert Column After
    Given the cursor is in a data table
    When "Insert Column After" is invoked
    Then insert a column after the current column
