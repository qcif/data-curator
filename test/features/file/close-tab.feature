Feature: Close tab
  As a Data Packager
  I want to close the active data tab and prompt if there are unsaved changes
  So that I can safely finish working with that data

  The Close tab command can be:
  - invoked by a menu item, shortcut or pressing the close button of the tab
  - cancelled

  If the data changes in the tab are unsaved, offer to cancel the command

  Scenario: Close the active tab and the data in the tab is saved
    Given I have opened Data Curator
    And I have opened 1 data tab
    And I have saved the data in the active tab
    When I invoke the "Close Tab" command
    Then close the active tab

  Scenario: Close tab but the data in the tab is unsaved
    Given I have opened Data Curator
    And I have opened 1 data tab
    And I haven't saved the data in the active tab
    When I invoke the "Close Tab" command
    Then provide a warning that there is unsaved work and offer to cancel the command, or quit the application
    And action the selection
