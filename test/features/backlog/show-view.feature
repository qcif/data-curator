@backlog  @enterprise-add-in  @draft

Feature: Show View
  As a Data Packager
  I want to preview the default view for the data
  So that it can sure it displays correctly before publishing


  Background:
    Given I have opened Data Curator
    And I have opened a data tab

  Scenario: Use the menu to set View Properties
    When I select "View Properties" from the menu
    Then display a panel that allows me to properties for the current column
    And accept and validate column property values
    And save the values as they are entered
