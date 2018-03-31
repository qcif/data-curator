Feature: Close tab
  As a Data Packager  
  I want to close the active data tab and be warned if there are unsaved changes  
  So that I can finish my work on that tab quickly and safely  

  RULES
  =====
  
  - The "Close Tab" command can be invoked by a menu item, shortcut or pressing the close button of the tab
  - The "Close Tab" command can be cancelled
  
  LATER
  =====
  
  - checking for unsaved data changes
  - invoke by a menu item or shortcut

  Scenario: Close the active tab and all data changes are saved
    Given Data Curator is open
    And all data changes in the active tab have been saved
    When "Close Tab" is invoked
    Then the active tab should close

  Scenario: Close the active tab and some data changes are not saved
    Given Data Curator is open
    And some data changes in the active tab have not been saved
    When "Close Tab" is invoked
    Then a warning to save unsaved work should be shown
