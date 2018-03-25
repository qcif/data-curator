Feature: Open a Semi-colon separated value file
  As a Data Packager
  I want to open a semi-colon separated value file
  So that I can describe, validate and package the data

  Rules
  =====

    - The Open Semi-colon separated value file command can be invoked using the menu command
    - The data will be stored in a ".csv" file
    - Use the default values in the [CSV Dialect specification](http://frictionlessdata.io/specs/csv-dialect/#specification) but with 'delimiter' = ';' to open the file and separate the values into the correct columns.

  Scenario: Open an existing semi-colon separated value file
    Given Data Curator is open
    When "Open semi-colon Separated" is invoked
    Then a prompt, requesting the 'filename' and location is shown
    And only files ending with a ".csv" can be selected
    And the selected 'filename' is opened in a new data tab to the right of any other open data tabs
    And set the Tab name to the 'filename'
    And set the CSV Dialect in the Table Properties to "Semi-colon Separated"
    And "Fix Ragged Rows"
    And "Freeze Header Row"
