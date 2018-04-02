@backlog

Feature: Open Recent
  As a User  
  I want to select from a list of files I have recently opened  
  So that I don't need to remember where they are located  
  
  RULES
  =====
  
  - "Open Recent" can be invoked by a menu command
  - "Clear Recent" can be invoked by a menu command
  
  USER INTERFACE
  ==============
  
  ![Open recent user interface](  https://user-images.githubusercontent.com/9379524/30209739-dce985f4-94dc-11e7-8ca7-a4667e5662d9.png
)

  Scenario: Open a recently opened file
    Given Data Curator is open
    When  "Open Recent" is invoked
    Then a list of recently opened filenames should be shown
    And the selected file should be opened in a new data tab to the right of other data tabs

  Scenario: Clear the recently opened file list
    Given Data Curator is open
    When "Clear Recent" is invoked
    Then the list of recently opened files should be deleted
