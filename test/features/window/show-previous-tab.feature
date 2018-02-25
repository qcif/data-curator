@backlog

Feature:  Show Previous Tab
  As a Data Packager
  I want to quickly move to the previous data tab (to the left)
  So that I can view related data

  If you are on the left-most tab, disable the Show previous tab menu option and keyboard shortcut.

  The "Show Previous Tab" command can be invoked using a menu item or keyboard shortcut

  Scenario: Use the menu to show the previous tab
    Given I have opened Data Curator
    And I have opened more than one tab
    And I have not selected the left-most tab
    When I invoke the "Next Tab" command
    Then deactive the current tab
    And activate the tab to the left
