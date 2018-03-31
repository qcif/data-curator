@backlog

Feature: Open file
  As a Data Packager  
  I want to open tabular data stored in one of a number of file formats  
  So that I can describe, validate and package the data  

  RULES
  =====

  - files can be opened from a URL or local path
  - The openfile dialog presents the user with a limited choice of file formats to open
  - The data will be stored in a `.csv`, `.tsv`, `.xls`, or `.xlsx` file
  - If `.csv` the file may be a comma or semicolon separated value file, inspect the data to infer the [CSV Dialect](http://frictionlessdata.io/specs/csv-dialect/) `delimiter` - `,` or `;`
  - If `.tsv` set the CSV Dialect `delimiter` to `\t`
  - If `.xls`, `.xlsx`
    - prompt to determine what Excel sheet to open
    - set the CSV Dialect `delimiter` to `,`
  - The "Open File" command can be invoked using the menu or a keyboard shortcut
  
  NOTES
  =====
  
  - This will replace the file type specific open commands

  Scenario: Open separated value file
    Given Data Curator is open
    When "Open File" is invoked
    Then the openfile dialog should be shown
    And the data should be opened in another data tab
    And the tab title should be set to the filename
    And the CSV Dialect `delimiter` should be set based on the file extension, data, and CSV Dialect defaults
    And "Fix Ragged Rows" should be invoked
    And "Freeze Header Row" should be invoked
    And "Guess Column Properties" should be invoked

  Scenario: Open Excel sheet
    Given Data Curator is open
    When "Open File" is invoked
    Then the openfile dialog should be shown
    And a prompt to select a sheet should be shown 
    And the data should be opened in another data tab
    And the tab title should be set to the filename
    And the CSV Dialect `delimiter` should be set based on the file extension, data, and CSV Dialect defaults
    And "Fix Ragged Rows" should be invoked
    And "Freeze Header Row" should be invoked
    And "Guess Column Properties" should be invoked
