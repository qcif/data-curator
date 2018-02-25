@backlog

Feature: Open Recent
  As a User
  I want to select from a list of files I have recently opened
  So that I don't need to remember where they are located

  Scenario: Open a recently opened file
    Given I have opened Data Curator
    When I select "Open Recent" from the menu
    Then a list of recently opened filenames are shown
    And the selected file is opened in a new data tab to the right of any other open data tabs

  Scenario: Clear the Open Recent list of files
    Given I have opened Data Curator
    When I select "Clear Menu" from the menu
    Then the the list of recently opened files is deleted
