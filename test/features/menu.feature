Feature: Initiate feature using menu
  In order to initiate a command
  As a Data Curator User
  I want to select a command from a menu when I don't know the keyboard shortcut or it doesn't appear on the toolbar

  Some menu items are required by the operating system e.g. Services on macOS

  Some menu items have different names on different operating systems e.g. Preferences on macOS is called Settings on Windows.

  Scenario: About menu item
    Given I have opened Data Curator
    When I select "Data Curator" from the menu
    And I select "About" from the sub-menu
    Then the About panel is shown

  Scenario: File, Open, Comma Separated menu item
    Given I have opened Data Curator
    When I select "File" from the menu
    And I select "Open" from the sub-menu
    And I select "Comma Separated" from the sub-sub-menu
    Then the Open, Comma Separated File prompt is shown
