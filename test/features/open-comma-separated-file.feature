Feature: Open a comma separated value file
  As a Data Packager
  I want to open a comma separated value (CSV) file
  So that I can describe, validate and package the data

  The most common form of separated value files is a comma separated value (CSV) file. Sometimes CSV data is stored in a text file (.txt).

  There are variations that use Tab or Semicolon to seperate values. Custom formats are sometimes used. Each of these formats can be described using a CSV Dialect that describes the 'delimiter' used and other options. See: http://specs.frictionlessdata.io/csv-dialect/#specification

  Use the CSV dialect specified in Preferences to determine how to open the file and seperate values into the right columns.

  Scenario: Use the menu to open an existing comma separated value file
    Given I have opened Data Curator
    When I select "Open", "Comma Separated" from the menu
    Then a prompt, requesting the file name and location is shown
    But only files ending with a ".csv" or ".txt" can be selected
    Then the selected file is opened in a new data tab to the right of any other open data tabs

  Scenario: Use a keyboard shortcut to open an existing comma separated value file
    Given I have opened Data Curator
    When I use the Open Comma Separated keyboard shortcut
    Then a prompt, requesting the file name and location is shown
    But only files ending with a ".csv" or ".txt" can be selected
    Then the selected file is opened in a new data tab to the right of any other open data tabs
