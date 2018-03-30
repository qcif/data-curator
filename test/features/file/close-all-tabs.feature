@backlog

Feature: Close all tabs
  As a Data Packager
  I want to close all data tabs and warn if there are unsaved changes
  So that I can finish my work quickly

  RULES
  =====

  - The "Close all tabs" command can be invoked by a menu item
  - The "Close all tabs" command can be cancelled

  Scenario: Close all tabs, all work saved
    Given Data Curator is open
    And all data changes have been saved
    When "Close all Tabs" is invoked
    Then all tabs should be closed

  Scenario: Close all tabs, some work unsaved
    Given Data Curator is open
    And some data changes have not been saved
    When "Close all Tabs" is invoked
    Then a warning to save unsaved work should be shown
