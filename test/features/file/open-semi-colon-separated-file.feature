Feature: Open a Semi-colon separated value file
  As a Data Packager
  I want to open a semi-colon separated value file
  So that I can describe, validate and package the data

  The data may be stored in a ".csv" file

  Use the default values in the [CSV Dialect specification](http://specs.frictionlessdata.io/csv-dialect/#specification) but with 'delimiter' = ';' to open the file and separate the values into the correct columns.

  (A desirable feature would be, If the active tab is empty, when the file is opened, insert the file contents into the empty table.)

  If the CSV has an inconsistent number of columns, [fix ragged rows] (https://relishapp.com/odi-australia/data-curator/docs/other/fix-ragged-rows)

  When the file is opened, invoke [Guess Column Properties](https://relishapp.com/odi-australia/data-curator/docs/tools/guess-column-properties)

  Scenario: Use the menu to open an existing semi-colon separated value file
    Given I have opened Data Curator
    When I select "Open Semi-colon Separated" from the menu
    Then a prompt, requesting the 'filename' and location is shown
    And only files ending with a ".csv" can be selected
    And the selected 'filename' is opened in a new data tab to the right of any other open data tabs
    And set the Tab name to the 'filename'
    And set the CSV Dialect in the Table Properties to "Semi-colon Separated"
    And "Fix Ragged Rows"
    And "Guess Column Properties"
    And "Freeze Header Row"
