Feature: Open an Excel Sheet
  As a User
  I want to open an Excel Sheet
  So that can describe, validate and package the data

  Rules
  =====

    - The "Open Excel Sheet" command can be invoked using the menu command
    - The data may be stored in a ".xlsx" or ".xls" file
    - Excel sheets may contain non-tabular data in a sheet, e.g. charts. Only tabular data will be opened.

  Scenario: Open an Excel Sheet
    Given Data Curator is open
    When "Open Excel Sheet" is invoked
    Then a prompt, requesting the file name and location is shown
    And only files ending with a '.xls' or '.xlsx' can be selected
    And a prompt, requesting the sheet to open is shown
    And the selected 'sheet-name' is opened in a new data tab to the right of any other open data tabs
    And set the Tab name to the 'sheet-name'
    And assign 'sheet-name' to the 'name' Table Property
    And "Fix Ragged Rows"
    And "Freeze Header Row"
