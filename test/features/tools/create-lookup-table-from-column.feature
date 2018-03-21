@backlog

Feature: Create Lookup Table from Column
  As a Data Packager
  I want to quickly make a look-up table
  So that I can improve the validation of the data and potentially add descriptions to the look-up values

  Scenario: Create Lookup Table from Column
    Given I have opened Data Curator
    And the cursor is in a column in a data tab
    When I invoke the "Create Lookup Table from Column" command
    Then read all the rows in that column
    And identify all the unique values
    And use the result to populate the first column a new data tab
    And assign the original column name to first column name
    And assign the original column name to the new data tab name
    And assign the original column name the new table name
    And make the new column a primary key
    And make the original column have a foreign key relationship with the new table and column
