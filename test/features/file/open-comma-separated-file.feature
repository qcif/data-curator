Feature: Open a Comma separated value file
  As a Data Packager
  I want to open a comma separated value (CSV) file
  So that I can describe, validate and package the data

  The most common form of separated value files is a comma separated value (CSV) file.

  The [CSV Dialect specification](http://frictionlessdata.io/specs/csv-dialect/#specification) describes variations that use Tab or Semicolon to seperate values. Custom formats are sometimes used. Each of these formats can be described using a CSV Dialect that describes the 'delimiter' and other options.

  Use the default CSV dialect values in the specification to open the file and separate the values into the correct columns.

  The Open Comma Separated command can be invoked using the menu or a keyboard shortcut

  Desirable features include:
  - If the active tab is empty, when the file is opened, insert the file contents into the empty table
  - "Guess Column Properties" on open

  @latest
  Scenario: Open an existing comma separated value file
    Given I have opened Data Curator
    When I click on the File->Open menu
    # Then a prompt, requesting the 'filename' and 'location' is shown
    # And only files ending with a ".csv" can be selected
    # And the selected 'filename' is opened in a new data tab to the right of any other open data tabs
    # And set the Tab name to the 'filename'
    # And set the CSV Dialect in the Table Properties to "Comma Separated"
    # And "Fix Ragged Rows"
    # And "Freeze Header Row"
