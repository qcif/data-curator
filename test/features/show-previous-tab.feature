Feature:  Show previous tab
  As a Data Packager
  I want to quickly move to the previous data tab (to the left)
  So that I can view related data

  If you are on the left-most tab, disable the Show next tab menu option and keyboard shortcut.

  Scenario: Use the menu to show the previous tab
    Given I have opened Data Curator
    And I have opened more than one tab
    And I have not selected the left-most tab
    When I select "Previous Tab" from the menu
    Then deactive the current tab
    And activate the tab to the left

  Scenario: Use a keyboard shortcut to show the previous tab
    Given I have opened Data Curator
    And I have opened more than one tab
    And I have not selected the left-most tab
    When I use the Previous Tab keyboard shortcut
    Then deactive the current tab
    And activate the tab to the left
