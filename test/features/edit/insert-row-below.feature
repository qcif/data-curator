Feature: Insert Row Below
  As a Data Packager
  I want to insert another row below the current row
  So that I can add more data to the data tab

  The "Insert Row Below" function can be invoked using a menu item or keyboard shortcut

  Scenario: Insert Row Below
    Given I have opened Data Curator
    And the cursor is in a row
    When I invoke the "Insert Row Below" function
    Then insert a row below the current row
    And move the cursor to the first column of the new row
