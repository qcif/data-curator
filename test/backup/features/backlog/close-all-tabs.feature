Feature: Close all tabs
  As a Data Packager
  I want to close all data tabs and warn if there are unsaved changes
  So that I can finish my work quickly

  The Close all tabs comand can be:
  - invoked by a menu item
  - cancelled

  Scenario: Close all tabs, all work saved
    Given I have opened Data Curator
    And I have opened 1 or more data tabs
    And I have saved the data in all the tabs
    When I invoke "Close all Tabs"
    Then Close all tabs

  Scenario: Close all tabs, some work unsaved
    Given I have opened Data Curator
    And I have opened 1 or more data tabs
    And I have not saved the data in all the tabs
    When I select "Close all Tabs"
    Then provide a warning that there is unsaved work and offer to cancel the command, or close all tabs
    And action the selection
