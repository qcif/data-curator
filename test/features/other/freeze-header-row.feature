Feature: Freeze Header Row
  As a Data Packager
  I want to freeze the header row (the first row)
  So that the data is not included in "Sort Column" command
  and the header row value may be able to be used to invoke the "Sort Column" command
  and the header row remains visable when the rows are scrolled

  Frozen Header Rows is the default and currently only state for Data Tabs

  Header Rows are frozen when a data file or new tab is opened

  Notes:
  - 'header' = 'true' is set in the CSV Dialect by default
  - 'name' properties are copied from the header row values by "Guess Column Properties"
  - see https://handsontable.com/examples.html?headers&sorting

  Scenario: Freeze Header Row
    Given I have opened Data Curator
    When a data tab is opened
    Then freeze the first row so that is does not scroll
    And use each header row value to invoke "Sort Column"
