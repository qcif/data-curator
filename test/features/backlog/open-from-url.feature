@backlog  @draft

Feature: Open from a URL
  As a User
  I want to open an file from a URL
  So that can I don't have to down the file and then open it

  Can type be auto-detected?
  May just be variant on other open functions but specify url instead of directory


  Scenario: Use the menu to open an Google Sheet
    Given I have opened Data Curator
    When I select Open, Google Sheet from the menu
    Then a prompt, requesting the file name and location is shown
    And a prompt, requesting the sheet to open is shown
    And the selected sheet is opened in a new data tab to the right of any other open data tabs
