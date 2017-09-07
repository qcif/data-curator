@draft

Feature: Add Tab
  As a Data Packager
  I want to add multiple related data files
  So that I can publish all the data in one data package

  Scenario: Add Tab
    Given I have opened Data Curator
    When I invoked the 'Add Tab' function
    Then add a 3x2 empty data Tab
    And name it 'untitled'
