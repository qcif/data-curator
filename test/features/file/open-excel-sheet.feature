Feature: Open an Excel Sheet
  As a User
  I want to open an Excel Sheet
  So that can describe, validate and package the data

  Excel sheets may contain non-tabular data in a sheet, e.g. charts

  The data may be stored in a ".xlsx" or ".xls" file

  If the active tab is empty, when the file is opened, insert the file contents into the empty table.

  If the CSV has an inconsistent number of columns, [fix ragged rows] (https://relishapp.com/odi-australia/data-curator/docs/other/fix-ragged-rows)

  When the file is opened, invoke [Guess Column Properties](https://relishapp.com/odi-australia/data-curator/docs/tools/guess-column-properties)

  Scenario: Use the menu to open an Excel Sheet
    Given I have opened Data Curator
    When I select Open, Excel Sheet from the menu
    Then a prompt, requesting the file name and location is shown
    But only files ending with a '.xls' or '.xlsx' can be selected
    And a prompt, requesting the sheet to open is shown
    And the selected 'sheet-name' is opened in a new data tab to the right of any other open data tabs
    And set the Tab name to the 'sheet-name'
    And assign 'sheet-name' to the 'name' Table Property
    And set the CSV Dialect in the Table Properties to "Comma Separated"
    And "Fix Ragged Rows"
    And "Guess Column Properties"
    And "Freeze Header Row"
