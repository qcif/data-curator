Feature: Insert Column Before
  As a Data Packager
  I want to insert another column before the current column
  So that I can add more data to the data tab

  The "Insert Column Before" command can be invoked using a menu item or keyboard shortcut

  Scenario: Use the menu to insert a column before the current column
    Given I have opened Data Curator
    And the cursor is in a column
    When I invoke the "Insert Column Before" command
    Then insert a column before the current column
    And move the cursor to the new column and the current row
