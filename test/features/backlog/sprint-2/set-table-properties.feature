@backlog @sprint-2

Feature: Set table properties
  As a Data Packager
  I want to...
  So that I can...

  Background:
    Given I have opened Data Curator
    And I have opened a data tab

  Scenario: Use the menu to access Table Properties for the current Tab
    When I select "Table Properties" from the menu
    Then display a panel that allows me to properties for the current Tab
    And accept and validate Table property values
    And save the values as they are entered

  Scenario: Use the toolbar access Table Properties for the current Tab
    When I select "Table Properties" from the toolbar
    Then display a panel that allows me to properties for the current Tab
    And accept and validate Table property values
    And save the values as they are entered
         
