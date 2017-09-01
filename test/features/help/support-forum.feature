Feature: Support Forum
  As a User
  I want to get support from the application community
  So that I can discuss and learn about the application

  Support will be launched in a separate browser window that will require access to the internet

  The Support URL will be on https://ask.theodi.org.au/c/projects/data-curator

  Scenario: Support Forum
    Given I have opened Data Curator
    When I invoke the "Support Forum" function
    Then Open the Support web-site in a separate browser window
