Feature: Insert Column Before
  As a Data Packager
  I want to insert another column before the current column
  So that I can add more data to the data table

  Rules:
    - The "Insert Column Before" command can be invoked using a menu item or keyboard shortcut

  Scenario: Use the menu to insert a column before the current column
    Given the cursor is in a data table 
    When I invoke the "Insert Column Before" command
    Then insert a column before the current column
