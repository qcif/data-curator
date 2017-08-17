Feature: Show Help
  As a Data Packager or Data Consumer
  I want to display help information
  So that I can learn how to use the application

  Not all operating systems have a keyboard shortcut for help. Windows has function key 1 (F1) but macOS does not have an equivalent convention.

  Help will be launched in a separate browser window that will require access to the internet. (In the future help may be embedded within Data Curator so no Internet connect is required.)

  Background:
    Given I have opened Data Curator

  Scenario: Use the menu to open help
    When I select "Help" from the menu
    Then Open the Help web-site in a separate browser window

  Scenario: Use a keyboard shortcut open help
    When I use the "Help" keyboard shortcut
    Then Open the Help web-site in a separate browser window
