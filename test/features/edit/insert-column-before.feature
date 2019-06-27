Feature: Insert Column Before
  As a Data Packager
  I want to insert another column before the current column
  So that I can add more data to the data table

  RULES
  =====

  - The "Insert Column Before" command can be invoked using a menu item, keyboard shortcut or a context menu in the data tab


  @impl
  Scenario Outline: Insert Column Before
    Given Data Curator is open
    And the table should have 1 row by 3 columns
    When the user clicks in row 1, column 2
    And the user types "<user input>"
    And the user clicks in row 1, column 1
    And the user right-clicks
    And the user clicks on "Insert Column Before"
    Then the table should have 1 row by 4 columns
    And the text: "<user input>" should be in row 1 column 3
    Examples:
      | user input |
      | test       |
