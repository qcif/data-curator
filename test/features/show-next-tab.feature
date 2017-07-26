Feature:  Show next tab
  In order to quickly move between data tables
  As a Data Packager
  I want to quickly move from the current active tab to the next tab to the right

  If you are on the right-most tab, disable the Show next tab menu option and keyboard shortcut.

  Scenario: Use the menu to show the next tab
    Given I have opened Data Curator
    And I have opened more than one tab
    And I have not selected the right-most tab
    When the Next Tab menu item is selected
    Then deactive the current tab
    And activate the tab to the right

  Scenario: Use a keyboard shortcut to show the next tab
    Given I have opened Data Curator
    And I have opened more than one tab
    And I have not selected the right-most tab
    When the Next Tab a keyboard shortcut is selected
    Then deactive the current tab
    And activate the tab to the right
