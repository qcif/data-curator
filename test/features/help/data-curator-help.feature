Feature: Support Forum
  As a User
  I want to get support from the application community
  So that I can discuss and learn about the application

  RULES
  =====

  - "Data Curator Help" can be invoked from a menu item
  - Support will be launched in a separate browser window that will require access to the internet
  - The Support URL will be on https://odiqueensland.github.io/data-curator-help

  @dev
  Scenario: Data Curator Help
    Given Data Curator is open
    When  "Data Curator Help" is invoked using the "application menu selection": "Help->Data Curator Help"
    Then a call to open an external url should be made
