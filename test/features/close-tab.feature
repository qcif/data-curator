Feature: Close tab
  As a Data Packager
  I want to close the active data tab and prompt if there are unsaved changes
  So that I can safely finish working with that data

  If the changes are to be saved, they will use the appropriate CSV dialect settings.

  If available, use the CSV dialect settings in associated Table Properties.

  If these are unavailable, then use the CSV dialect specified in Preferences.

  By default the CSV dialect will be a comma separated file with defaults settings as documented in http://specs.frictionlessdata.io/csv-dialect/#specification

  The CSV dialect selected may change the file extension e.g. tab separated values files use .tsv

  Scenario: Use the menu to close the active tab and work in the tab is saved
    Given I have opened Data Curator
    And I have opened 1 data tab
    And I have saved the data in the active tab
    When I select Close Tab from the menu
    Then close the active tab

  Scenario: Use a keyboard shortcut to close the active tab and work in the tab is saved
    Given I have opened Data Curator
    And I have opened 1 data tab
    And I have saved the data in the active tab
    When I use the Close Tab shortcut
    Then close the active tab

  Scenario: Click the close button on a tab to close the tab and work in the tab is saved
    Given I have opened Data Curator
    And I have opened 1 data tab
    And I have saved the data in the active tab
    When I click the close tab button
    Then close the active tab

  Scenario: Use the menu to close the active tab but work in the tab is unsaved
    Given I have opened Data Curator
    And I have opened 1 data tab
    And I haven't saved the data in the active tab
    When I select "Close Tab" from the menu
    Then a prompt, save the unsaved data table in its current CSV Dialect, is displayed

  Scenario: Use a keyboard shortcut to close active tab but work in the tab is unsaved
    Given I have opened Data Curator
    And I have opened 1 data tab
    And I haven't saved the data in the active tab
    When I use the Close Tab shortcut
    Then a prompt, save the unsaved data table in its current CSV Dialect, is displayed

  Scenario: Click the close button on a tab to close the tab but work in the tab is unsaved
    Given I have opened Data Curator
    And I have opened 1 data tab
    And I haven't saved the data in the active tab
    When I click the close tab button
    Then a prompt, save the unsaved data table in its current CSV Dialect, is displayed
