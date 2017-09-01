Feature:  Show Next Tab
  As a Data Packager
  I want to quickly move to the next data tab (to the right)
  So that I can view related data

  If you are on the right-most tab, disable the Show next tab menu option and keyboard shortcut.

  The "Show Next Tab" function can be invoked using a menu item or keyboard shortcut

  Scenario: Use the menu to show the next tab
    Given I have opened Data Curator
    And I have opened more than one tab
    And I have not selected the right-most tab
    When I invoke the "Next Tab" function
    Then deactive the current tab
    And activate the tab to the right
