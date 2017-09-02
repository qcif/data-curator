@backlog

Feature: Check for update
  As a Data Packager or Data Consumer
  I want to update to the lastest version of the application
  So that I gain access to the lastest bug fixes and new features

  Software releases will be available on GitHub https://github.com/ODIQueensland/data-curator/releases/latest
  Different releases are available for different <operating system> and <platform>

  Rules:
  - Check for update can be invoked manually and is run automatically when the application starts.
  - Check for update is disabled if there is no connection to the Internet available.
  - Application state is remembered so files open before the update are re-opened in the same state.

  Scenario: Automatically Check for update on application start
    Given I have have not open Data Curator
    And I am using an <operating system> on a <platform>
    When I open the application
    Then check if an update is available for my <operating system> and <platform>
    And install the new application
    And restart the application
    And restore state

  Scenario: Manually Check for update, all work saved
    Given I have opened Data Curator
    And I am using an <operating system> on a <platform>
    And I have opened 1 or more data tabs
    And I have saved the data in all the tabs
    When I select "Check for update" from the menu
    Then check if an update is available for my <operating system> and <platform>
    And install the new application
    And restart the application
    And restore state

  Scenario: Manually Check for update, some work not saved
    Given I have opened Data Curator
    And I am using an <operating system> on a <platform>
    And I have opened 1 or more data tabs
    And I have not saved the data in all the tabs
    When I select "Check for update" from the menu
    Then check if an update is available for my <operating system> and <platform>
    And prompts to save each unsaved data table in its current CSV Dialect, are displayed
    And install the new application
    And restart the application
    And restore state
