Feature: Close tab
  As a Data Packager
  I want to close the active data tab and prompt if there are unsaved changes
  So that I can safely finish working with that data

  Rules
  =====
  
  - The Close tab command can be invoked by a menu item, shortcut or pressing the close button of the tab
  - The Close tab command can be cancelled

  Scenario: Close the active tab, data changes saved
    Given Data Curator is open
    And all data changes in the active tab have been saved
    When "Close Tab" is invoked
    Then the active tab should close

  Scenario: Close the active tab, data changes not saved
    Given Data Curator is open
    And some data changes in the active tab have not been saved
    When "Close Tab" is invoked
    Then a warning should appear prompting to save unsaved work 
