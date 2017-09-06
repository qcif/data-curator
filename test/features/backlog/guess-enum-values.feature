@backlog

Feature: Guess Enum values
  As a Data Packager
  I want to find all unique values in a column of data
  So that I quickly define the enum constraint

  If the number of unique values in the enum exceed a limit, then error.
  Suggest enum not appropriate constraint or clean data first (e.g. sort column, use Open Refine)

  Scenario: Guess Enum values
    Given I have opened Data Curator
    And the cursor is in a column in a data tab
    When I select "Guess Enum values" from the menu
    Then read all the rows in that column
    And identify all the unique values
    And use the result to populate the enum constraint
