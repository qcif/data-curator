Feature: Open a semi-colon separated value file
  As a Data Packager
  I want to open a semi-colon separated value file
  So that I can describe, validate and package the data

  Semi-colon separated value file formats can be described using a CSV Dialect that describes the 'delimiter' used and other options. See: http://specs.frictionlessdata.io/csv-dialect/#specification

  Use the CSV dialect specified in Preferences to determine how to open the file and seperate values into the right columns.

  Unresolved:
  Is the a standard semi-colon format e.g. 'delimiter' = ';' or should I read the CSV Dialect settings in Preferences for other settings?

  Scenario: Use the menu to open an existing tab separated value file
    Given I have opened Data Curator
    When I select "Open", "Tab Separated" from the menu
    Then a prompt, requesting the file name and location is shown
    But only files ending with a ".tsv" or ".txt" can be selected
    Then the selected file is opened in a new data tab to the right of any other open data tabs
