Feature: Show help
  In order to get help on how to use Data Curator
  As a user of Data Curator
  I want to display help information

  Not all operating systems have a keyboard shortcut for help. Windows has function key 1 (F1) but macOS does not have an equivelent convention.

  Help will be launched in a separate browser window that will require access to the internet. (In the future help may be embedded within Data Curator so no Internet connect is required.)

  Scenario: Use the menu to open help
    Given I have opened Data Curator
    When I select "Help" from the menu
    Then Open the Help web-site in a separate browser window

  Scenario: Use a keyboard shortcut open help
    Given I have opened Data Curator
    When I use the Help keyboard shortcut
    Then Open the Help web-site in a separate browser window
