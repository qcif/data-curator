@backlog

Feature: Open an Custom CSV Dialect file
  As a Data Packager
  I want to open a separated value file with a custom CSV Dialect
  So that I can package data stored on non-standard separated value files

  The data may be stored in a ".tsv", ".csv" or ".txt" file

  Custom separated value file formats can be described using a CSV Dialect
  CSV dialect specification - http://specs.frictionlessdata.io/csv-dialect/#specification

  Use the CSV dialect specified in Table Properties to determine how to open the file and seperate values into the correct columns

  If there are no CSV dialect settings specified in Table Properties, use the CSV dialect specified in Preferences

  If there are no CSV dialect settings specified, prompt the use to supply them

  Scenario: Open an existing custom dialect separated value file
    Given I have opened Data Curator
    When I invoke the "Open, Custom Dialect" function
    Then a prompt, requesting the 'filename' and location is shown
    But only files ending with a ".csv", ".tsv" or ".txt" can be selected
    Then the selected file is opened using the CSV dialect in a new data tab to the right of any other open data tabs
    And name the tab the 'filename'
