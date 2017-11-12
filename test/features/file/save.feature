Feature: Save
  As an Data Packager
  I want to save the changes made to the data in the active data tab using the appropriate CSV dialect settings
  So that I can progressively save my work

  If available, use the CSV dialect settings in associated Table Properties.

  If these are unavailable, then use the CSV dialect specified in Preferences.

  By default the CSV dialect will be a comma separated file with defaults settings as documented in http://frictionlessdata.io/specs/csv-dialect/#specification

  The CSV dialect selected may change the file extension e.g. tab separated values files use .tsv

  If the data has never been saved, prompt the user for a file name and location

  The "Save" command can be invoked from a menu item or a keyboard shortcut

  Scenario: Save data that has never been saved
    Given I have opened Data Curator
    And I have opened 1 data tab
    And I have changed the data in the active tab
    And I have never saved the data
    When I invoke the "Save" command
    Then prompt for a location and name to save the filename
    And save the data in the active tab at that location, using the filename, and using the CSV dialect settings

  Scenario: Save data that has been saved at least once
    Given I have opened Data Curator
    And I have opened 1 data tab
    And I have changed the data in the active tab
    And the data has been saved at least once
    When I invoke the "Save" command
    And save the data in the active tab at its current location, using the filename, and using the CSV dialect settings
