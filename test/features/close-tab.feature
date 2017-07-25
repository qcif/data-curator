  Feature: Close tab
    In order to quickly finish work
    As a Data Packager
    I want to safely close the active data tab
    But Not lose my changes. If I have unsaved work in that tab, prompt me to save it. Save the data using the CSV dialect set in the associated Table Properties
    Or, if that is null, use the CSV dialect specified in Preferences.
    By default the CSV dialect will be a comma separated file with defaults settings as documented in http://specs.frictionlessdata.io/csv-dialect/#specification

# unresolved
# - how to document keyboard shortcuts across operating systems
# - should scenario names be unique? 

    Scenario: Close tab
      Given I have opened Data Curator
      And I open 1 data tab
      And I save the data in the active tab
      When I select Close Tab from the menu
      Then close the active tab

    Scenario: Close tab
      Given I have opened Data Curator
      And I open 1 data tab
      And I do not save the data in the active tab
      When I select Close Tab from the menu
      Then a prompt, save the unsaved data table in its current CSV Dialect, is displayed
