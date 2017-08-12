Feature: Insert Column Before
  As a Data Packager
  I want to insert another column before the current column
  So that I can add more data to the data tab

  Background:
    Given I have opened Data Curator
    And the cursor is in a column

  Scenario: Use the menu to insert a column before the current column
    When I select "Insert Column Before" from the menu
    Then insert a column before the current column
    And move the cursor to the new column and the current row

  Scenario: Use a keyboard shortcut to insert a column before the current column
    When I use the Insert Column Before keyboard shortcut
    Then insert a column before the current column
    And move the cursor to the new column and the current row
