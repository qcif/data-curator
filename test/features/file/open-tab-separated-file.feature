Feature: Open a Tab separated value file
  As a Data Packager
  I want to open a tab separated value (TSV) file
  So that I can describe, validate and package the data

  The data may be stored in a ".tsv" file

  Use the default values in the [CSV Dialect specification](http://specs.frictionlessdata.io/csv-dialect/#specification) but with 'delimiter' = '\t' to open the file and separate the values into the correct columns.

  (A desirable feature would be, If the active tab is empty, when the file is opened, insert the file contents into the empty table.)

  If the CSV has an inconsistent number of columns, [fix ragged rows] (https://relishapp.com/odi-australia/data-curator/docs/other/fix-ragged-rows)

  When the file is opened, invoke [Guess Column Properties](https://relishapp.com/odi-australia/data-curator/docs/tools/guess-column-properties)

  Scenario: Use the menu to open an existing Tab Separated Value file
    Given I have opened Data Curator
    When I select "Open Tab Separated" from the menu
    Then a prompt, requesting the 'filename' and location is shown
    And only files ending with ".tsv" can be selected
    And the selected 'filename' is opened in a new data tab to the right of any other open data tabs
    And set the Tab name to the 'filename'
    And set the CSV Dialect in the Table Properties to "Tab Separated"
    And Fix Ragged Rows
    And Guess Column Properties
