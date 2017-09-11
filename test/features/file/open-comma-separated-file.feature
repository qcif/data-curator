Feature: Open a Comma separated value file
  As a Data Packager
  I want to open a comma separated value (CSV) file
  So that I can describe, validate and package the data

  The most common form of separated value files is a comma separated value (CSV) file. Sometimes CSV data is stored in a text file (.txt)

  There are variations that use Tab or Semicolon to seperate values. Custom formats are sometimes used. Each of these formats can be described using a CSV Dialect that describes the 'delimiter' used and other options. See: http://specs.frictionlessdata.io/csv-dialect/#specification

  Use the default CSV dialect values in the specification to open the file and separate the values into the correct columns.

  The Open Comma Separated command can be invoked using the menu or a keyboard shortcut

  If the active tab is empty, when the file is opened, insert the file contents into the empty table.

  If the CSV has an inconsistent number of columns, fix ragged rows (see separate feature in Other)

  Scenario: Open an existing comma separated value file
    Given I have opened Data Curator
    And the file to be opened has inconsistent number of columns
    When I invoke the "Open Comma Separated" command
    Then a prompt, requesting the 'filename' and 'location' is shown
    And only files ending with a ".csv" or ".txt" can be selected
    And the selected 'filename' is opened in a new data tab to the right of any other open data tabs
    And set the Tab name to the 'filename'
    And set the CSV Dialect in the Table Properties to "Comma Separated"
    And Fix Ragged Rows
