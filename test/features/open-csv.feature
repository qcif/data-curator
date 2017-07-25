Feature: Open a comma separated value file
  In order to start packaging existing data
  As a Data Packager
  I want to open a comma separated value (CSV) file. Then it can be described, validated, and shared.

  The most common form of separated value files is a comma separated value (CSV) file. Sometimes CSV data is stored in a text file (.txt).

  There are variations that use Tab or Semicolon to seperate values. Custom formats are sometimes used. Each of these formats can be described using a CSV Dialect that describes the `delimiter` used and other options. See: http://specs.frictionlessdata.io/csv-dialect/#specification

  Scenario: Open a comma separated value file
    Given I have opened Data Curator
    When I select Open, Comma Separated from the menu, or
#    When Save is selected from the menu, or
#    When using macOS, the Command + O shortcut is pressed, or
#    When using Windows, ... , or
#    When using Linux, ...
    Then a prompt, requesting the file name and location is shown
    But only if it is a '.csv' or '.txt' file
    Then the selected file is opened
    And displayed in a table in a new tab 
