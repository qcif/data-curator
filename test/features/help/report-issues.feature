Feature: Report Issues
  As a User
  I want to report issues I find in the application
  So that I can help improve the application

  Support will be launched in a separate browser window that will require access to the internet

  The Report Issues URL will be hosted on https://github.com/ODIQueensland/data-curator/blob/master/.github/CONTRIBUTING.md

  Scenario: Use the menu to open the report issues page
    Given I have opened Data Curator
    When I select "Report Issues" from the menu
    Then Open the Report Issues URL in a separate browser window
