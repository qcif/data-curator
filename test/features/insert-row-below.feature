Feature: Insert Row Below
  As a Data Packager
  I want to insert another row below the current row
  So that I can add more data to the data tab

  Background:
    Given I have opened Data Curator
    And the cursor is in a row

  Scenario: Use the menu to insert a row below the current row
    When I select "Insert Row Below" from the menu
    Then insert a row below the current row
    And move the cursor to the first column of the new row

  Scenario: Use a keyboard shortcut to insert a row below the current row
    When I use the Insert Row Below keyboard shortcut
    Then insert a row below the current row
    And move the cursor to the first column of the new row
