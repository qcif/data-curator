  Feature: Close tab
    In order to quickly finish work
    As a Data Packager
    I want to safely close the active data tab

    I want to safely close the active data tab and prompt if there are unsaved changes.

    If the changes are to be saved, they will use the appropriate CSV dialect settings.

    If available, use the CSV dialect settings in associated Table Properties.

    If these are unavailable, then use the CSV dialect specified in Preferences.

    By default the CSV dialect will be a comma separated file with defaults settings as documented in http://specs.frictionlessdata.io/csv-dialect/#specification

    Scenario: I use the menu to close a tab with saved data
      Given I have opened Data Curator
      And I have opened 1 data tab
      And I have saved the data in the active tab
      When I select Close Tab from the menu
      Then close the active tab

    Scenario: I use a keyboard shortcut to close a tab with saved data
      Given I have opened Data Curator
      And I have opened 1 data tab
      And I have saved the data in the active tab
      When I use the Close Tab shortcut
      Then close the active tab

    Scenario: I click the close button on a tab to a close a tab with saved data
      Given I have opened Data Curator
      And I have opened 1 data tab
      And  I have saved the data in the active tab
      When I click the close tab button
      Then close the active tab

    Scenario: I use the menu to close a tab with unsaved data
      Given I have opened Data Curator
      And I have opened 1 data tab
      And I haven't saved the data in the active tab
      When I select Close Tab from the menu
      Then a prompt, save the unsaved data table in its current CSV Dialect, is displayed

    Scenario: I use a keyboard shortcut to close a tab with unsaved data
      Given I have opened Data Curator
      And I have opened 1 data tab
      And I haven't saved the data in the active tab
      When I use the Close Tab shortcut
      Then a prompt, save the unsaved data table in its current CSV Dialect, is displayed

    Scenario: I click the close button on a tab to a close a tab with unsaved data
      Given I have opened Data Curator
      And I have opened 1 data tab
      And I haven't saved the data in the active tab
      When I click the close tab button
      Then a prompt, save the unsaved data table in its current CSV Dialect, is displayed
