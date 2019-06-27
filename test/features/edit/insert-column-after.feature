Feature: Insert Column After
  As a Data Packager
  I want to insert another column after the current column
  So that I can add more data to the data table

  RULES
  =====

  - The "Insert Column After" command can be invoked using a menu item, keyboard shortcut or a context menu in the data tab

  @impl
  Scenario Outline: Insert Column After
    Given Data Curator is open
    And the table should have 1 row by 3 columns
    When the user clicks in row 1, column 2
    And the user types "<user input>"
    And the user clicks in row 1, column 3
    And the user right-clicks
    And the user clicks on "Insert Column After"
    Then the table should have 1 row by 4 columns
    And the text: "<user input>" should be in row 1 column 2
    Examples:
      | user input |
      | test       |
