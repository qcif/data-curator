Feature: Open a Semi-colon separated value file
  As a Data Packager  
  I want to open a semi-colon separated value file  
  So that I can describe, validate and package the data  

  RULES
  =====

  - The Open Semi-colon separated value file command can be invoked using the menu command
  - The data has been stored in a ".csv" file
  - Use the default values in the [CSV Dialect specification](http://frictionlessdata.io/specs/csv-dialect/#specification) but with 'delimiter' = ';' to open the file and separate the values into the correct columns.

  Scenario: Open an existing semi-colon separated value file
    Given Data Curator is open
    When "Open semi-colon Separated" is invoked
    Then a prompt, requesting the 'filename' and location should be shown
    And another tab containing the data should be opened 
    And the tab title should be set to the filename
    And the CSV Dialect `delimiter` should be set based on the file extension and CSV Dialect defaults
    And "Fix Ragged Rows" should be invoked
    And "Freeze Header Row" should be invoked
    And "Guess Column Properties" should be invoked
