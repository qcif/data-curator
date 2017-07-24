Feature: Close tab
In order to close a data tab I've finished using
As a Data Packager
I want to safely close the active data tab so I don't lose my changes

Scenario: Close tab

   Given Data Curator is open
     And one or more data tabs are open

    When Close Tab is selected from the menu
    When using macOS, the Command W shortcut is pressed
    When using Windows, ...
    When using Linux, ...
    When the Close icon in the data tab is selected

    Then check that the data in the active data tab has been saved
     And if it has, close the active tab
     And if it hasn't, display a prompt to save the unsaved data table in its current CSV Dialect
