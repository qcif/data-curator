@backlog

Feature:  Show Previous Tab
  As a Data Packager
  I want to quickly move to the previous data tab (to the left)
  So that I can view related data

  Rules
  =====

    - If you are on the left-most tab, disable the Show previous tab menu option and keyboard shortcut.
    - The "Show Previous Tab" command can be invoked using a menu item or keyboard shortcut

  Scenario: Use the menu to show the previous tab
    Given Data Curator is open
    And more than one tab is open
    And the left-most tab is not selected
    When I invoke the "Next Tab" command
    Then deactive the current tab
    And activate the tab to the left
