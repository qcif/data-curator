Feature: Insert Row Above
  As a Data Packager
  I want to insert another row above the current row
  So that I can add more data to the data table

  RULES
  =====

  - If a row is inserted above the first row and the CSV dialect has 'headerRow' set to 'true', then the 'name' property for each column may be invalidated.
  - The "Insert Row Above" command can be invoked using a menu item, keyboard shortcut or a context menu in the data tab

  @impl
  Scenario Outline: Insert Row Above
    Given Data Curator is open
    And the table should have 1 row by 3 columns
    When the user clicks in row 1, column 1
    And the user types "<user input>"
    And the user right-clicks
    And the user clicks on "Insert Row Above"
    Then the table should have 2 rows by 3 columns
    And the text: "<user input>" should be in row 2 column 1
    Examples:
      | user input |
      | test       |
