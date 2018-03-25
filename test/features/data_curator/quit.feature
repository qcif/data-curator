Feature: Quit
  As a Data Packager or Data Consumer
  I want to close the application and prompt if there are unsaved changes.
  So that I can quickly and safely finish work

  RULES
  =====

    - Different operating systems use different terms to end the application:
      - Windows uses "Close"
      - macOS uses "Quit".
    - "Quit" can be invoked by a menu item, keyboard shortcut, or system functions

  Scenario: Quit the application, all work saved
    Given Data Curator is open
    And one or more data tabs are open
    And all data changes have been saved
    When "Quit" is invoked
    Then all tabs close
    And the application quits

  Scenario: Quit the application, some work unsaved
    Given Data Curator is open
    And one or more data tabs are open
    And some data changes have not been saved
    When "Quit" is invoked
    Then warn that there is unsaved changes and offer to cancel the command, or quit the application
    And action the selection
