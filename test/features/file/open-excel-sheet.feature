Feature: Open an Excel Sheet
  As a User  
  I want to open an Excel Sheet  
  So that can describe, validate and package the data  

  RULES
  =====

  - The "Open Excel Sheet" command can be invoked using the menu command
  - The data may be stored in a ".xlsx" or ".xls" file
  - Excel sheets may contain non-tabular data in a sheet, e.g. charts. Only tabular data will be opened.

  Scenario: Open an Excel Sheet
    Given Data Curator is open
    When "Open Excel Sheet" is invoked
    Then a prompt, requesting the file name and location should be shown
    And only files ending with a '.xls' or '.xlsx' should be able to be selected
    And a prompt, requesting the sheet to open should be shown
    And the selected 'sheet-name' should be opened in a new data tab to the right of any other open data tabs
    And the Tab name should be set to the 'sheet-name'
    And the Table Property 'name' should be set to the 'sheet-name'
    And "Fix Ragged Rows" should be invoked 
    And "Freeze Header Row" should be invoked 
