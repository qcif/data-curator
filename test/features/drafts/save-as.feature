@draft

Feature: Save as
  As an Data Packager
  I want to save the data changes in the active data tab using the users preferences and the appropriate CSV dialect settings.
  In order to save any data changes to a different name, location or CSV dialect.

  If available, use the CSV dialect settings in associated Table Properties.

  If these are unavailable, then use the CSV dialect specified in Preferences.

  By default the CSV dialect will be a comma separated file with defaults settings as documented in http://frictionlessdata.io/specs/csv-dialect/#specification

  The CSV dialect selected may change the file extension e.g. tab separated values files use .tsv

  Scenario: Use the menu to save the data to a different name or location
    Given I have opened Data Curator
    And I have opened 1 data tab
    When I select "Save As" from the menu
    Then a prompt, requesting the file name and location is displayed
    And using the response, the data is saved using CSV Dialect preferences
    And adjusting the file extension to match the CSV Dialect.

  Scenario: Use a keyboard shortcut to save the data to a different name or location
    Given I have opened Data Curator
    And I have opened 1 data tab
    When I use the "Save As" keyboard shortcut
    Then a prompt, requesting the file name and location is displayed
    And using the response, the data is saved using CSV Dialect preferences
    And adjusting the file extension to match the CSV Dialect.
