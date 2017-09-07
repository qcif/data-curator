Feature: New 
  As a Data Packager
  I want to open a blank data tab so I can start to enter data values
  So that I can create new data

  Background:
    Given I have opened Data Curator

  Scenario: Use the menu to open a new data tab
    When I select "New" from the menu
    Then open a new data tab to the right of any other open data tabs
    And display a empty table with 3 columns and 2 rows
    And place the cursor in first column and first row

  Scenario: Use a keyboard shortcut to open a new data tab
    When I use the "New" keyboard shortcut
    Then open a new data tab to the right of any other open data tabs
    And display a table with 3 columns and 2 rows with no values in any cell
    And place the cursor in first column and first row
