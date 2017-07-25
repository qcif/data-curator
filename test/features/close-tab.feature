Feature: Close tab
  In order to close a data tab I've finished using
  As a Data Packager
  I want to safely close the active data tab so I don't lose my changes using the CSV dialect set in the associated Table Properties or if that is null, the CSV dialect specified in Preferences. By default the CSV dialect will be a comma separated file with defaults settings as documented in http://specs.frictionlessdata.io/csv-dialect/#specification

  Scenario: Close tab
    Given Data Curator is open
    And one or more data tabs are open
    When Close Tab is selected from the menu, or
    When using macOS, the Command W shortcut is pressed, or
    When using Windows, ... , or
    When using Linux, ... , or
    When the Close button in the data tab is pressed
    Then check that the data in the active data tab has been saved
    And if it has, close the active tab
    And if it hasn't, display a prompt to save the unsaved data table in its current CSV Dialect
