@backlog

Feature: Create Lookup Table from Column
  As a Data Packager  
  I want to quickly make a look-up table  
  So that I can improve the validation of the data and potentially add descriptions to the look-up values  

  Scenario: Create Lookup Table from Column
    Given Data Curator is open
    And the cursor is in a column in a data tab
    When "Create Lookup Table from Column" is invoked
    Then read all the rows in that column
    And identify all the unique values
    And the result should be used to populate the first column a new data tab
    And the original column name should be assigned to first column name
    And the original column name should be assigned to the new data tab name
    And the original column name should be assigned to the new table name
    And the new column should be set as a primary key
    And the original column should be set as a foreign key relationship with the new table and column
