@backlog

Feature: Open file using Drag and Drop
  As a User
  I want to drag a file onto the Application
  So that can I quickly start working with the data 

  RULES
  =====
  
  - Valid file types are .csv, .tsv, .xls, .xlsx
  - If `.csv` the file may be a comma or semicolon separated value file, inspect the data to infer the [CSV Dialect](http://frictionlessdata.io/specs/csv-dialect/) `delimiter` - `,` or `;`
  - If `.tsv` set the CSV Dialect `delimiter` to `\t`
  - If `.xls`, `.xlsx`
    - prompt to determine what Excel Sheet to open
    - set the CSV Dialect `delimiter` to `,`

  Scenario: Drag a valid file type on to the application
    Given Data Curator is open
    When I Drag and Drop a comma separated value file type on to the application
    Then another tab containing the data should be opened 
    And the tab title should be set to the filename
    And the CSV Dialect `delimiter` should be set based on the file extension, data, and CSV Dialect defaults
    And "Fix Ragged Rows" should be invoked
    And "Freeze Header Row" should be invoked
    And "Guess Column Properties" should be invoked

  Scenario: Drag an invalid file type on to the application
    Given Data Curator is open
    When I Drag and Drop an invalid file type on to the application
    Then nothing should happen
