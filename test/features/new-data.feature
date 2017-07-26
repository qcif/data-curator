Feature: New data
  In order to create new data
  As a Data Creator
  I want to open a blank data tab so I can start to enter data values

  Scenario: I use the menu to open a new data tab
    Given I have opened Data Curator
    When the New menu item is selected
    Then open a new data tab to the right of any other open data tabs
    And display a empty table with 3 columns and 2 rows
    And place the cursor in first column A, row 1

  Scenario: I use a keyboard shortcut to open a new data tab
    Given I have opened Data Curator
    When I use the New keyboard shortcut
    Then open a new data tab to the right of any other open data tabs
    And display a table with 3 columns and 2 rows with no values in any cell
    And place the cursor in column A, row 1
