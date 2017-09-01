Feature: Help
  As a Data Packager or Data Consumer
  I want to display help information
  So that I can learn how to use the application

  The "Help" function can be invoked using a menu item or perhaps a keyboard shortcut

  Not all operating systems have a keyboard shortcut for help. Windows has function-key 1 (F1) but macOS does not have an equivalent convention.

  Help will be launched in a separate browser window that will require access to the internet. (In the future help may be embedded within Data Curator so no Internet connect is required.)

  Scenario: Help
    Given I have opened Data Curator
    When I invoke the "Help" function
    Then open the Help web-site in a separate browser window
