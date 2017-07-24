Feature: Save data
  In order to save any edits made to the data as a separated value file
  As an Data Packager
  I want to save the changes made in the active data tab using the CSV dialect set in Table Properties or if this is null, the CSV dialect specified in Preferences. By default the CSV dialect will be a comma separated file with defaults settings as documented in http://specs.frictionlessdata.io/csv-dialect/#specification

  Scenario: Save data

     Given Data Curator is open
       And a data tab is open
       And one value is in a cell

      When Save is selected from the menu, or
      When using macOS, the Command + S shortcut is pressed, or
      When using Windows, ... , or
      When using Linux, ... , or
      When the Close button in the data tab is selected

      Then save the data in the active data tab in the CSV dialect set in the Table Properties or if this is not set, the CSV dialect set in Preferences
