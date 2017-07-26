Feature: Initiate feature using menu
  In order to initiate a command when I don't know keyboard shortcuts or it doesn't appear on the toolbar
  As a Data Curator User
  I want to select a command from a menu

  Some menu items are required by the operating system e.g. Services on macOS

  Some menu items have different names on different operating systems e.g. Preferences on macOS or Settings on Windows.

  Scenario: About menu item
    Given I have opened Data Curator
    When I select Data Curator from the menu
    And I select About from the submenu
    Then the About panel is shown
