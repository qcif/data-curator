Feature: Save as
  In order to save data in a format suited to the data consumers
  As a Data Packager
  I want to save the data into a common or custom CSV dialect.

    Then save the data in the active data tab in the CSV dialect set in the Table Properties or if this is not set, the CSV dialect set in Preferences
    And set the file extension to '.tsv' if the 'delimiter' property is set to a tab character, otherwise set the file extension to ''.csv'


Feature: Save as
  In order to save any data changes under a different name, location or format
  As an Data Packager
  I want to save the data changes in the active data tab using the users preferences and the appropriate CSV dialect settings.

  If available, use the CSV dialect settings in associated Table Properties.

  If these are unavailable, then use the CSV dialect specified in Preferences.

  By default the CSV dialect will be a comma separated file with defaults settings as documented in http://specs.frictionlessdata.io/csv-dialect/#specification

  If the CSV dialect selected is a tab separated file, then set the file extension to '.tsv'.

  Scenario: I use the menu to save the data to a different name or location
    Given I have opened Data Curator
    And I have opened 1 data tab
    When I select Save As from the menu
    Then a prompt, requesting the file name and location is displayed
    And using the response, the data is saved using CSV Dialect preferences
    And adjusting the file extension to match the CSV Dialect.
