Feature: Insert Column After
  As a Data Packager
  I want to insert another column after the current column
  So that I can add more data to the data tab

  The "Insert Column After" command can be invoked using a menu item or keyboard shortcut

  Scenario: Insert Column After
    Given I have opened Data Curator
    And the cursor is in a column
    When I invoke the "Insert Column After" command
    Then insert a column after the current column
    And move the cursor to the new column and the current row
