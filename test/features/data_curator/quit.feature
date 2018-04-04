Feature: Quit
  As a Data Packager or Data Consumer  
  I want to close the application and be warned if there are unsaved changes  
  So that I can quickly and safely finish work  

  RULES
  =====

  - Different operating systems use different terms to end the application:
    - Windows uses "Close"
    - macOS uses "Quit".
  - "Quit" can be invoked by a menu item, keyboard shortcut, or system functions
  - "Quit" can be cancelled
  
  LATER
  =====
  
  - check for unsaved data changes. If all changes are saved, quit Data Curator

  Scenario: Quit the application and all data changes are saved
    Given Data Curator is open
    And all data changes have been saved
    When "Quit" is invoked
    Then a warning to save unsaved work should be shown

  Scenario: Quit the application and some data changes are not saved
    Given Data Curator is open
    And some data changes have not been saved
    When "Quit" is invoked
    Then a warning to save unsaved work should be shown

  Scenario: Quit application
    Given Data Curator is open
    And "Quit" is invoked
    When "Quit" is selected
    Then Data Curator should quit

  Scenario: Cancel Quit
    Given Data Curator is open
    And "Quit" is invoked
    When "Cancel" is selected
    Then Data Curator should remain running
