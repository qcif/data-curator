@backlog

Feature: Open Recent
  As a User  
  I want to select from a list of files I have recently opened  
  So that I don't need to remember where they are located  
  
  RULES
  =====
  
  - "Open Recent" can be invoked by a menu command
  - "Clear Recent" can be invoked by a menu command

  Scenario: Open a recently opened file
    Given Data Curator is open
    When  "Open Recent" is invoked
    Then a list of recently opened filenames should be shown
    And the selected file should be opened in a new data tab to the right of other data tabs

  Scenario: Clear the recently opened file list
    Given Data Curator is open
    When "Clear Recent" is invoked
    Then the list of recently opened files should be deleted
