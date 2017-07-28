Feature: Quit Application
  As a Data Packager or Data Consumer
  I want to close the application and prompt if there are unsaved changes.
  So that I can quickly and safely finish work

  Different operating systems use different terms to end the application. Windows uses "Close"; macOS uses "Quit".

  If the changes are to be saved, they will use the appropriate CSV dialect settings.

  If available, use the CSV dialect settings in associated Table Properties.

  If these are unavailable, then use the CSV dialect specified in Preferences.

  By default the CSV dialect will be a comma separated file with defaults settings as documented in http://specs.frictionlessdata.io/csv-dialect/#specification

  The CSV dialect selected may change the file extension e.g. tab separated values files use .tsv

  Scenario: Use the menu to close the application, all work saved
    Given I have opened Data Curator
    And I open 1 or more data tabs
    And I save all the data in every tab
    When I select "Close Application" from the menu
    Then all tabs close
    And the application closes

  Scenario: Use a keyboard shortcut to close the application, all work saved
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
