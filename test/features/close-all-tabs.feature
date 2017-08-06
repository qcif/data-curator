Feature: Close all tabs
  As a Data Packager
  I want to close all data tabs and prompt if there are unsaved changes
  So that I can finish my work quickly

  If the changes are to be saved, they will use the appropriate CSV dialect settings.

  If available, use the CSV dialect settings in associated Table Properties.

  If these are unavailable, then use the CSV dialect specified in Preferences.

  By default the CSV dialect will be a comma separated file with defaults settings as documented in http://specs.frictionlessdata.io/csv-dialect/#specification

  The CSV dialect selected may change the file extension e.g. tab separated values files use .tsv

  Scenario: Use the menu to close all tabs, all work saved
    Given I have opened Data Curator
    And I have opened 1 or more data tabs
    And I have saved the data in all the tabs
    When I select "Close all Tabs" from the menu
    Then all tabs close

  Scenario: Use a keyboard shortcut to close all tabs, all work saved
    Given I have opened Data Curator
    And I have opened 1 or more data tabs
    And I have saved the data in all the tabs
    When I use the "Close all Tabs" shortcut
    Then all tabs close

  Scenario: Use the menu to close all tabs, some work unsaved
    Given I have opened Data Curator
    And I have opened 1 or more data tabs
    And I have not saved the data in all the tabs
    When I select "Close all Tabs" from the menu
    Then prompts to save each unsaved data table in its current CSV Dialect, are displayed

  Scenario: Use a keyboard shortcut to close all tabs, some work unsaved
    Given I have opened Data Curator
    And I have opened 1 or more data tabs
    And I have not saved the data in all the tabs
    When I use the "Close all Tabs" shortcut
    Then prompts to save each unsaved data table in its current CSV Dialect, are displayed
