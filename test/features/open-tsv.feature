Feature: Open a tab separated value file
  In order to start packaging existing data
  As a Data Packager
  I want to open a tab separated value (TSV) file.

  Tab separated value file formats can be described using a CSV Dialect that describes the 'delimiter' used and other options. See: http://specs.frictionlessdata.io/csv-dialect/#specification

  Use the CSV dialect specified in Preferences to determine how to open the file and seperate values into the right columns.

  Unresolved:
  Is the a standard TSV format or should I read the CSV Dialect settings in Preferences?

  Scenario: I use the menu to open an existing tab separated value file
    Given I have opened Data Curator
    When I select Open, Tab Separated from the menu
    Then a prompt, requesting the file name and location is shown
    But only files ending with a '.tsv' or '.txt' can be selected
    Then the selected file is opened in a new data tab to the right of any other open data tabs
