Feature: Save all data
  In order to save all data changes quickly
  As a Data Packager
  I want to unsaved changes across all open data tabs

  If available, use the CSV dialect settings in associated Table Properties.

  If these are unavailable, then use the CSV dialect specified in Preferences.

  By default the CSV dialect will be a comma separated file with defaults settings as documented in http://specs.frictionlessdata.io/csv-dialect/#specification

  The CSV dialect selected may change the file extension e.g. tab separated values files use .tsv

  Scenario: Use the menu to save all data changes and all data saved once
    Given I have opened Data Curator
    And I have opened 1 or more data tabs
    And I have saved all data tabs at least once
    When I select "Save All" from the menu
    Then save data changes in every tab using the CSV dialect settings

  Scenario: Use the menu to save all data changes but some data never saved
    Given I have opened Data Curator
    And I have opened 1 or more data tabs
    And I have not saved every data tab at least once
    When I select "Save All" from the menu
    Then for new data, a prompt is displayed requesting the file name and location
    And using the response, save changes using the CSV Dialect preferences
    And for previously saved data, save changes using the CSV dialect settings



Scenario: Use a keyboard shortcut to save all data changes
  Given I have opened Data Curator
  And I open 1 or more data tabs
  And I save all the data in every tab
  When I use the Close keyboard shortcut
  Then all tabs close
  And the application closes

Scenario: Use the menu to close the application, some work unsaved
  Given I have opened Data Curator
  And I open 1 or more data tabs
  And I do not save the data in every tab
  When I select "Close Application" from the menu
  Then a prompt for each unsaved data tab is displayed to save unsaved data in its current CSV Dialect
  And the application closed

Scenario: Use a keyboard shortcut to close the application, some work unsaved
  Given I have opened Data Curator
  And I open 1 or more data tabs
  And I do not save the data in every tab
  When I use the Close Application keyboard shortcut
  Then a prompt for each unsaved data tab is displayed to save unsaved data in its current CSV Dialect
  And the application closed
