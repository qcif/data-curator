Feature: Open an Excel Sheet
  As a User
  I want to open an Excel Sheet
  So that can describe, validate and package the data

  Excel sheets may contain non-tabular data in a sheet, e.g. charts

  Unresolved:
  - Do we support .xls?

  Scenario: Use the menu to open an Excel Sheet
    Given I have opened Data Curator
    When I select Open, Excel Sheet from the menu
    Then a prompt, requesting the file name and location is shown
    But only files ending with a '.xls' or '.xlsx' can be selected
    And a prompt, requesting the sheet to open is shown
    And the selected 'sheet-name' is opened in a new data tab to the right of any other open data tabs
    And name the tab the 'sheet-name'
    And add the 'sheet-name' to the 'name' Table Property
