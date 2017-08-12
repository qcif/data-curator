Feature: Show Support
  As a User
  I want to get support from the application community
  So that I can discuss and learn about the application

  Support will be launched in a separate browser window that will require access to the internet

  Unresolved:
  - The support URL will be hosted on https://ask.theodi.org.au/c/projects but the exact page is not determined

  Scenario: Use the menu to open the support page
    Given I have opened Data Curator
    When I select "Support" from the menu
    Then Open the Support web-site in a separate browser window
