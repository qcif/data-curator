Feature: Open a Comma separated value file
  As a Data Packager
  I want to open a comma separated value (CSV) file
  So that I can describe, validate and package the data

  RULES
  =====

  - The Open Comma Separated command can be invoked using the menu or a keyboard shortcut
  - The data will be stored in a ".csv" file
  - The most common form of separated value files is a comma separated value (CSV) file. The [CSV Dialect specification](http://frictionlessdata.io/specs/csv-dialect/#specification) describes variations that use Tab or Semicolon to seperate values. Custom formats are sometimes used. Each of these formats can be described using a CSV Dialect that describes the 'delimiter' and other options.
  - Use the default CSV dialect values in the specification to open the file and separate the values into the correct columns.

  LATER
  =====

  - "Guess Column Properties" on opening the file

  @impl
  Scenario: Open an existing comma separated value file
    Given Data Curator is open
    When the "File"->"Open"->"Comma separated..." menu is selected
    Then the openfile dialog should be displayed
    And another tab with its filename as the title should be displayed
    And the table rows and columns should match the "csv" file
    # And set the CSV Dialect in the Table Properties to "Comma Separated"
    # And "Fix Ragged Rows"
    # And "Freeze Header Row"
