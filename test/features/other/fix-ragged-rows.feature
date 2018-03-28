Feature: Fix Ragged Rows
  As a Data Packager  
  I want each row of data to have the same number of columns  
  So that I can create a valid separated value file  

  Scenario: Fix Ragged Rows
    Given Data Curator is open
    When a data file is opened 
    Then find the maximum number of columns in the data and append empty cells to all rows with less columns
