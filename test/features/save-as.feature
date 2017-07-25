Feature: Save as
  In order to save data in a format suited to the data consumers
  As a Data Packager
  I want to save the data into a common or custom CSV dialect. The CSV dialect to be used is set in the Table Properties or if this is null, the CSV dialect specified in Preferences. By default the CSV dialect will be a comma separated file with defaults settings as documented in http://specs.frictionlessdata.io/csv-dialect/#specification

  Scenario: Save as
    Given Data Curator is open
    And a data tab is open
    And one value is in a cell
    When Save As is selected from the menu
    Then prompt for a file name and location to save the data
    Then save the data in the active data tab in the CSV dialect set in the Table Properties or if this is not set, the CSV dialect set in Preferences
    And set the file extension to '.tsv' if the 'delimiter' property is set to a tab character, otherwise set the file extension to ''.csv'
