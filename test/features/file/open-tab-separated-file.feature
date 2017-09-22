Feature: Open a Tab separated value file
  As a Data Packager
  I want to open a tab separated value (TSV) file
  So that I can describe, validate and package the data

  The data may be stored in a ".tsv" file

  CSV dialect specification - http://specs.frictionlessdata.io/csv-dialect/#specification

  Use the default CSV dialect values in the specification but with 'delimiter' = '\t' to open the file and separate the values into the correct columns.
  If the CSV has an incosistent number of columns, fix ragged rows (see separate feature in Other)

  If the active tab is empty, when the file is opened, insert the file contents into the empty table.

  If the CSV has an inconsistent number of columns, fix ragged rows (see separate feature in Other)

  Scenario: Use the menu to open an existing Tab Separated Value file
    Given I have opened Data Curator
    When I select "Open Tab Separated" from the menu
    Then a prompt, requesting the 'filename' and location is shown
    And only files ending with ".tsv" can be selected
    And the selected 'filename' is opened in a new data tab to the right of any other open data tabs
    And set the Tab name to the 'filename'
    And set the CSV Dialect in the Table Properties to "Tab Separated"
    And Fix Ragged Rows
