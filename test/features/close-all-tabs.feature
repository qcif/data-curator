Feature: Close all tabs
  In order to finish work quickly
  As a Data Packager
  I want to close all data tabs and prompt if there are unsaved changes.

  If the changes are to be saved, they will use the appropriate CSV dialect settings.

  If available, use the CSV dialect settings in associated Table Properties.

  If these are unavailable, then use the CSV dialect specified in Preferences.

  By default the CSV dialect will be a comma separated file with defaults settings as documented in http://specs.frictionlessdata.io/csv-dialect/#specification


  Scenario: I use the menu to close all tabs, all with saved data
    Given I have opened Data Curator
    And I open 1 data tab
    And I save the data in the tab
    When I select Close all Tabs from the menu
    Then all tabs close

  Scenario: I use a keyboard shortcut to close all tabs, all with saved data
    Given I have opened Data Curator
    And I open more than 1 data tab
    And I save all the data in the tab
    When I select Close all Tabs from the menu
    Then all tabs close

  Scenario: I use the menu to close all tabs, some with unsaved data
    Given I have opened Data Curator
    And I open 1 data tab
    And I do not save the data in the tab
    When I select Close all Tabs from the menu
    Then a prompt, save each unsaved data table in its current CSV Dialect, is displayed

  Scenario: I use a keyboard shortcut to close all tabs, some with unsaved data
    Given I have opened Data Curator
    And I open more than 1 data tab
    And I do not save the data in the tab
    When I select Close all Tabs from the menu
    Then a prompt, save each unsaved data table in its current CSV Dialect, is displayed
