@backlog

Feature:  Show Next Tab
  As a Data Packager
  I want to quickly move to the next data tab (to the right)
  So that I can view related data

  Rules
  =====

    - If you are on the right-most tab, disable the Show next tab menu option and keyboard shortcut.
    - The "Show Next Tab" command can be invoked using a menu item or keyboard shortcut

  Scenario: Use the menu to show the next tab
    Given Data Curator is open
    And more than one tab is open
    And the right-most tab is not selected
    When "Next Tab" is invoked
    Then deactive the current tab
    And activate the tab to the right
