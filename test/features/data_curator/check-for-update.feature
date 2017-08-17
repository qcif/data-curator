@backlog

Feature: Check for update
  As a Data Packager or Data Consumer
  I want to update to the lastest version of the application
  So that I gain access to the lastest bug fixes and new features

  Software releases will be available on GitHub https://github.com/ODIQueensland/data-curator/releases/latest

  Scenario: Use the menu to Check for update, all work saved
    Given I have opened Data Curator
    And I am using an <operating system>
    And I have opened 1 or more data tabs
    And I have saved the data in all the tabs
    When I select "Check for update" from the menu
    Then check if an update is available for my <operating system>
    And install the new application
    And restart the application

  Scenario: Use the menu to Check for update, some work not saved
    Given I have opened Data Curator
    And I am using an <operating system>
    And I have opened 1 or more data tabs
    And I have not saved the data in all the tabs
    When I select "Check for update" from the menu
    Then check if an update is available for my <operating system>
    And prompts to save each unsaved data table in its current CSV Dialect, are displayed
    And install the new application
    And restart the application
