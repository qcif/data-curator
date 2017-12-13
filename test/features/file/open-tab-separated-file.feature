Feature: Open a Tab separated value file
  As a Data Packager
  I want to open a tab separated value (TSV) file
  So that I can describe, validate and package the data

  The Open Tab separated value file command can be invoked using the menu command

  The data may be stored in a ".tsv" file

  Use the default values in the [CSV Dialect specification](http://frictionlessdata.io/specs/csv-dialect/#specification) but with 'delimiter' = '\t' to open the file and separate the values into the correct columns.

  Desirable features include:
  - If the active tab is empty, when the file is opened, insert the file contents into the empty table
  - "Guess Column Properties" on open

  If the CSV has an inconsistent number of columns, [fix ragged rows] (https://relishapp.com/odi-australia/data-curator/docs/other/fix-ragged-rows)

  Scenario: Open an existing Tab Separated Value file
    Given I have opened Data Curator
    When I invoke the "Open Tab Separated" command
    Then a prompt, requesting the 'filename' and location is shown
    And only files ending with ".tsv" can be selected
    And the selected 'filename' is opened in a new data tab to the right of any other open data tabs
    And set the Tab name to the 'filename'
    And set the CSV Dialect in the Table Properties to "Tab Separated"
    And "Fix Ragged Rows"
    And "Freeze Header Row"
