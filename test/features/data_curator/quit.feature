Feature: Quit
  As a Data Packager or Data Consumer
  I want to close the application and prompt if there are unsaved changes.
  So that I can quickly and safely finish work

  Different operating systems use different terms to end the application. Windows uses "Close"; macOS uses "Quit".

  "Quit Application" can be invoked by a menu item, keyboard shortcut, or system functions

  Scenario: Quit the application, all work saved
    Given I have opened Data Curator
    And I open 1 or more data tabs
    And I save all the data in every tab
    When I invoke "Quit Application"
    Then all tabs close
    And the application quits

  Scenario: Quit the application, some work unsaved
    Given I have opened Data Curator
    And I open 1 or more data tabs
    And I do not save the data in every tab
    When I invoke "Quit Application"
    Then provide a warning that there is unsaved work and offer to cancel the command, or quit the application
    And action the selection
