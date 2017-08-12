Feature: Fix Ragged Rows
  As a Data Packager
  I want to make the data have the same number of columns
  So that I can create a valid separated value file

  Scenario: Fix Ragged Rows
    Given I have opened Data Curator
    And I have opened 1 data tab
    When I select "Fix Ragged Rows" from the menu
    Then find the maximum number of rows in the data and append empty cells to all rows with less columns
