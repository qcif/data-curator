Feature: Save
  As an Data Packager
  I want to save the changes made to the data in the active data tab using the appropriate CSV dialect settings
  So that I can progressively save my work

  Rules
  =====

  - The "Save" command can be invoked from a menu item or a keyboard shortcut
  - The "Save" command is only enabled after a file has been saved for the first time using "Save As"

  Scenario: Save data
    Given Data Curator is open
    And one data tab is open
    And the data has been saved at least once
    When "Save" is invoked
    Then save the data in the active tab at its current location and filename
