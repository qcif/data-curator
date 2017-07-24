Feature: Save all data
  In order to quickly save all the changes made to the data
  As a  Data Packager
  I want to save the changes made in the every data tab using the CSV dialect set in the associated Table Properties or if that is null, the CSV dialect specified in Preferences. By default the CSV dialect will be a comma separated file with defaults settings as documented in http://specs.frictionlessdata.io/csv-dialect/#specification

  Scenario: Save all data

     Given Data Curator is open
       And one or more data tabs are open

      When Save All is selected from the menu, or
      When on macOS, presses Option + Command + S
      When using Windows, ...
      When using Linux, ...

      Then save all the data in all the data tabs in the CSV dialect set in the Table Properties or if this is not set, the CSV dialect set in Preferences
