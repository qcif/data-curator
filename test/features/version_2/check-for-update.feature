Feature: Check for update
  As a Data Packager or Data Consumer
  I want to update to the lastest version of the application
  So that I gain access to the lastest bug fixes and new features

  Rules:
  - Check for update is run automatically when the application starts
  - Check for update requires a connection to the Internet
  - Software releases will be available on GitHub https://github.com/ODIQueensland/data-curator/releases/latest
  - Different releases are available for different <operating system> and <platform>
  - Allow user to defer the update

  Scenario: Check for update on application start
    Given I have have not open Data Curator
    And I am using an <operating system> on a <platform>
    When I open the application
    Then check if an update is available for my <operating system> and <platform>
    And prompt to download and install update
    And download and install the new application
    And restart the application
