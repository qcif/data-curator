@backlog @sprint-2

Feature: Open an Excel Sheet
  As a Data Packager
  I want to open an Excel Sheet
  So that can describe, validate and package the data

  Excel sheets may contain non-tabular data, e.g. charts

  Unresolved:
  - Do we support .xls?

  Scenario: Use the menu to open an Excel Sheet
    Given I have opened Data Curator
    When I select Open, Excel Sheet from the menu
    Then a prompt, requesting the file name and location is shown
    But only files ending with a '.xls' or '.xlsx' can be selected
    Then the selected file is opened in a new data tab to the right of any other open data tabs
