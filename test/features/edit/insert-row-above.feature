Feature: Insert Row Above
  As a Data Packager
  I want to insert another row above the current row
  So that I can add more data to the data tab

  If a row is inserted above the first row and the CSV dialect has 'headerRow' set to 'true', then the 'name' property for each column may be invalidated.

  Background:
    Given I have opened Data Curator
    And the cursor is in a row

  Scenario: Use the menu to insert a row above the current row
    When I select "Insert Row Above" from the menu
    Then insert a row above the current row
    And move the cursor to the current column and the new row

  Scenario: Use a keyboard shortcut to insert a row above the current row
    When I use the Insert Row Above keyboard shortcut
    Then insert a row above the current row
    And move the cursor to the current column and the new row
