@backlog  @enterprise-add-in  @draft

Feature: Set View Properties
  As a Data Packager
  I want to default view for the data
  So that it can be displayed to potentially instantly answer a question

  See https://hackmd.io/s/SyTcmXPwl

  Background:
    Given I have opened Data Curator
    And I have opened a data tab

  Scenario: Use the menu to set View Properties
    When I select "View Properties" from the menu
    Then display a panel that allows me to properties for the current column
    And accept and validate column property values
    And save the values as they are entered
