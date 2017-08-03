@backlog @sprint-2

Feature: Set provenance information
  As a Data Packager
  I want to...
  So that I can...

  Background:
    Given I have opened Data Curator
    And I have opened a data tab

  Scenario: Use the menu to access provenance information for the current Tab
    When I select "Provenance Information" from the menu
    Then display a panel that allows me to enter provenance information as markdown for the current Tab
    And save the values as they are entered

  Scenario: Use the toolbar access provenance information for the current Tab
    When I select "Provenance" from the toolbar
    Then display a panel that allows me to enter provenance information as markdown for the current Tab
    And save the values as they are entered
