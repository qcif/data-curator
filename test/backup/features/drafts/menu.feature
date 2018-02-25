@draft

Feature: Initiate feature using menu
  As a Data Packager or Data Consumer
  I want to select a command from a menu
  So that I can initiate a command that I don't the keyboard shortcut for and does not appear in the toolbar

  Some menu items are required by the operating system e.g. Services on macOS

  Some menu items have different names on different operating systems e.g. Preferences on macOS is called Settings on Windows.

  Background:
    Given I have opened Data Curator

  Scenario: About menu item
    When I select "Data Curator" from the menu
    And I select "About" from the sub-menu
    Then the About panel is shown

  Scenario: File, Open, Comma Separated menu item
    When I select "File" from the menu
    And I select "Open" from the sub-menu
    And I select "Comma Separated" from the sub-sub-menu
    Then the Open, Comma Separated File prompt is shown
