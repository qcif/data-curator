@backlog

Feature: Create Constraint from Column
  As a Data Packager
  I want to find all unique values in a column of data
  So that I quickly define the enum constraint

  RULES
  =====

    - If the number of unique values in the enum exceed a limit, then error.
    - Suggest enum not appropriate constraint, clean data, or create reference table and foreign key relationship.
    - The "Create Constraint from Column" command can be invoked using a menu item

  Scenario: Create Constraint from Column
    Given Data Curator is open
    And the cursor is in a column in a data tab
    When "Create Constraint from Column" is invoked
    Then read all the rows in that column
    And identify all the unique values
    And use the result to populate the enum constraint
