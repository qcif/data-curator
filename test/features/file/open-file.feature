@backlog

Feature: Open file
  As a Data Packager
  I want to open tabular data stored in one of a number of file formats
  So that I can describe, validate and package the data

  Rules:
    - The openfile dialog presents the user with a limited choice of file formats to open
    - The data will be stored in a `.csv`, `.tsv`, `.xls`, or `.xlsx` file
    - If `.csv` the file may be a comma or semicolon separated value file, inspect the data to infer the [CSV Dialect](http://frictionlessdata.io/specs/csv-dialect/) `delimiter` - `,` or `;`
    - If `.tsv` set the CSV Dialect `delimiter` to `\t`
    - If `.xls`, `.xlsx`
      - prompt to determine what Excel Sheet to open
      - set the CSV Dialect `delimiter` to `,`
    - The "Open File" command can be invoked using the menu or a keyboard shortcut

  Scenario: Open a file
    Given Data Curator is open
    When "Open File" is invoked
    Then the openfile dialog is shown
    And another tab is opened with its filename as the title
    And set the CSV Dialect `delimiter` in the Table Properties based on the file extension, data and CSV Dialect defaults
    And "Fix Ragged Rows"
    And "Freeze Header Row"
    And "Guess Column Properties"
