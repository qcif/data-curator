Feature: Insert Column After
  As a Data Packager
  I want to insert another column after the current column
  So that I can add more data to the data tab

  Background:
    Given I have opened Data Curator
    And the cursor is in a column

  Scenario: Use the menu to insert a column after the current column
    When I select "Insert Column After" from the menu
    Then insert a column after the current column
    And move the cursor to the new column and the current row

  Scenario: Use a keyboard shortcut to insert a column after the current column
    When I use the Insert Column After keyboard shortcut
    Then insert a column after the current column
    And move the cursor to the first column of the new column and the current row
