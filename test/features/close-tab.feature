Feature: Close tab
  In order to finish working with the data
  As a Data Packager
  I want to close the active data tab and prompt if there are unsaved changes.

  If the changes are to be saved, they will use the appropriate CSV dialect settings.

  If available, use the CSV dialect settings in associated Table Properties.

  If these are unavailable, then use the CSV dialect specified in Preferences.

  By default the CSV dialect will be a comma separated file with defaults settings as documented in http://specs.frictionlessdata.io/csv-dialect/#specification

  Scenario: Use the menu to close the active tab and the data has already been saved
    Given I have opened Data Curator
    And I have opened 1 data tab
    And I have saved the data in the active tab
    When I select Close Tab from the menu
    Then close the active tab

  Scenario: Use a keyboard shortcut to close the active tab and the data has already been saved
    Given I have opened Data Curator
    And I have opened 1 data tab
    And I have saved the data in the active tab
    When I use the Close Tab shortcut
    Then close the active tab

  Scenario: Click the close button on a tab to close the tab and the data has already been saved
    Given I have opened Data Curator
    And I have opened 1 data tab
    And I have saved the data in the active tab
    When I click the close tab button
    Then close the active tab

  Scenario: Use the menu to close the active tab but the data has not been saved
    Given I have opened Data Curator
    And I have opened 1 data tab
    And I haven't saved the data in the active tab
    When I select Close Tab from the menu
    Then a prompt, save the unsaved data table in its current CSV Dialect, is displayed

  Scenario: Use a keyboard shortcut to close active tab but the data has not been saved
    Given I have opened Data Curator
    And I have opened 1 data tab
    And I haven't saved the data in the active tab
    When I use the Close Tab shortcut
    Then a prompt, save the unsaved data table in its current CSV Dialect, is displayed

  Scenario: Click the close button on a tab to close the tab and the data has not been saved
    Given I have opened Data Curator
    And I have opened 1 data tab
    And I haven't saved the data in the active tab
    When I click the close tab button
    Then a prompt, save the unsaved data table in its current CSV Dialect, is displayed
