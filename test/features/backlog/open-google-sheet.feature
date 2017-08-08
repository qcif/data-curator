Feature: Open a Google Sheet
  As a User
  I want to open an Google Sheet
  So that can describe, validate and package the data

  Scenario: Use the menu to open an Google Sheet
    Given I have opened Data Curator
    When I select Open, Google Sheet from the menu
    Then a prompt, requesting the file name and location is shown
    And a prompt, requesting the sheet to open is shown
    And the selected sheet is opened in a new data tab to the right of any other open data tabs
