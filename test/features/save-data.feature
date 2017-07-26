Feature: Save data
  In order to save any changes made to the data
  As an Data Packager
  I want to save the changes made to the data in the active data tab using the appropriate CSV dialect settings.

  If available, use the CSV dialect settings in associated Table Properties.

  If these are unavailable, then use the CSV dialect specified in Preferences.

  By default the CSV dialect will be a comma separated file with defaults settings as documented in http://specs.frictionlessdata.io/csv-dialect/#specification

  Scenario: I use the menu to save the data
    Given I have opened Data Curator
    And I have opened 1 data tab
    And I have changed the data in the active tab
    When I select Save from the menu
    Then save the data in the active tab using the CSV dialect settings

  Scenario: I use a keyboard shortcut to save the data
    Given I have opened Data Curator
    And I have opened 1 data tab
    And I have changed the data in the active tab
    When I select Save from the menu
    Then save the data in the active tab using the CSV dialect settings
