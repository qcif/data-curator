Feature: Fix Ragged Rows
  As a Data Packager
  I want to make the data have the same number of columns
  So that I can create a valid separated value file

  Scenario: Fix Ragged Rows
    Given I have opened Data Curator
    When I open any data file
    Then find the maximum number of columns in the data and append empty cells to all rows with less columns
