Feature: Close tab
  As a Data Packager
  I want to close the active data tab and prompt if there are unsaved changes
  So that I can safely finish working with that data

  The Close tab command can be:
  - invoked by a menu item, shortcut or pressing the close button of the tab
  - cancelled

  If the data changes in the tab are unsaved, offer to save the changes

  If the changes are to be saved, they will use the appropriate CSV dialect settings.
  - If available, use the CSV dialect settings in associated Table Properties.
  - If these are unavailable, then use the CSV dialect specified in Preferences.
  - By default the CSV dialect will be a comma separated file with defaults settings as documented in http://specs.frictionlessdata.io/csv-dialect/#specification
  - The CSV dialect selected may change the file extension e.g. tab separated values files use .tsv


  Scenario: Close the active tab and the data in the tab is saved
    Given I have opened Data Curator
    And I have opened 1 data tab
    And I have saved the data in the active tab
    When I invoke "Close Tab"
    Then close the active tab

  Scenario: Close tab but the data in the tab is unsaved
    Given I have opened Data Curator
    And I have opened 1 data tab
    And I haven't saved the data in the active tab
    When I invoke "Close Tab"
    Then a prompt, cancel, close or save the unsaved data table in its current CSV Dialect, is displayed
    And the selection is actioned
