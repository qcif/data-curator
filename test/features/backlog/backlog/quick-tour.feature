Feature: Show Quick Tour
  As a Data Packager or Data Consumer
  I want to display help information
  So that I can learn how to use the application

  Not all operating systems have a keyboard shortcut for help. Windows has function key 1 (F1) but macOS does not have an equivalent convention.

  Help will be launched in a separate browser window that will require access to the internet. (In the future help may be embedded within Data Curator so no Internet connect is required.)

  Scenario: Use the menu to open the Quick Tour
    Given I have opened Data Curator
    When I select "Quick Tour" from the menu
    Then Open the Help web-site in a separate browser window
