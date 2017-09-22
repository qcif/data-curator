Feature: Insert Row Above
  As a Data Packager
  I want to insert another row above the current row
  So that I can add more data to the data tab

  If a row is inserted above the first row and the CSV dialect has 'headerRow' set to 'true', then the 'name' property for each column may be invalidated.

  The "Insert Row Above" command can be invoked using a menu item or keyboard shortcut

  Scenario: Insert Row Above
    Given I have opened Data Curator
    And the cursor is in a row
    When I invoke the "Insert Row Above" command
    Then insert a row above the current row
    And move the cursor to the current column and the new row
