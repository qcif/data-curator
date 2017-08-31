Feature: Open a Comma separated value file
  As a Data Packager
  I want to open a comma separated value (CSV) file
  So that I can describe, validate and package the data

  The most common form of separated value files is a comma separated value (CSV) file. Sometimes CSV data is stored in a text file (.txt)

  There are variations that use Tab or Semicolon to seperate values. Custom formats are sometimes used. Each of these formats can be described using a CSV Dialect that describes the 'delimiter' used and other options. See: http://specs.frictionlessdata.io/csv-dialect/#specification

  Use the default CSV dialect values in the specification to open the file and separate the values into the correct columns.

  The Open Comma Separated function can be invoked using the menu or a keyboard shortcut

  Scenario: Use the menu to open an existing comma separated value file
    Given I have opened Data Curator
    When I invoke the "Open Comma Separated" function
    Then a prompt, requesting the 'filename' and location is shown
    And only files ending with a ".csv" or ".txt" can be selected
    And the selected 'filename' is opened in a new data tab to the right of any other open data tabs
    And name the tab the 'filename'
