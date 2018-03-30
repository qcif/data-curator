@backlog

Feature: Save as
  As an Data Packager
  I want to save the data changes in the active data tab to a valid separated value file format
  So that the data can be retrieved later

  RULES
  =====

  - The default file type will be a comma separated file and the and CSV dialect delimiter ","
  - If available in Preferences, update the default the file type and CSV dialect delimiter 
  - The CSV dialect selected may change the file extension e.g. tab separated values files use .tsv
  - The "Save as..." command can be invoked from the menu or using a keyboard shortcut
  - The "Save as..." command can be cancelled 

  Scenario: Save the data 
    Given I have opened Data Curator
    And a CSV Dialect Preference may have been set
    When "Save As..." is invoked
    Then a prompt using the defaults and requesting the file type, name and location should be displayed
    And the file should be saved with that file type, name and location
