Feature: Fix Ragged Rows
  As a Data Packager
  I want to make the data have the same number of columns
  So that I can create a valid separated value file

  The "Fix Ragged Rows" function can be invoked using a menu item

  Scenario: Fix Ragged Rows
    Given I have opened Data Curator
    And I have opened 1 data tab
    When I invoke the "Fix Ragged Rows" function
    Then find the maximum number of rows in the data and append empty cells to all rows with less columns
