Feature:  Show next tab
  As a Data Packager
  I want to quickly move to the next data tab (to the right)
  So that I can view related data

  If you are on the right-most tab, disable the Show next tab menu option and keyboard shortcut.

  Background:
    Given I have opened Data Curator
    And I have opened more than one tab
    And I have not selected the right-most tab

  Scenario: Use the menu to show the next tab
    When I select "Next Tab" from the menu
    Then deactive the current tab
    And activate the tab to the right

  Scenario: Use a keyboard shortcut to show the next tab
    When I use the Next Tab keyboard shortcut
    Then deactive the current tab
    And activate the tab to the right
