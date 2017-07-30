@backlog @sprint-2

Feature: Set data package properties
  As a Data Packager
  I want to describe
  So that it can be

  The Data Package properties are defined in http://specs.frictionlessdata.io/data-package/

  The application only works with Tabular Data Packages
  Tabular Data Package properties are defined in http://specs.frictionlessdata.io/tabular-data-package/

  The 'name', 'type' and 'format' can be pre-populated using Guess Column Properties

  A 'name' must be entered for each column. 'name' will be defaulted from the value in the first row, unless the CSV Dialect 'header' is 'false'

  The 'title' and 'description' are optional


  Background:
    Given I have opened Data Curator
    And I have opened a data tab
    And the cursor is in a column

  Scenario: Use the menu to access Data Package Properties
    When I select "Data Package Properties" from the menu
    Then display a panel that allows me to enter properties
    And accept and validate property values
    And save the values as they are entered

  Scenario: Use the toolbar access Data Package for the current column
    When I select "Package" from the toolbar
    Then display a panel that allows me to properties for the current column
    And accept and validate column property values
    And save the values as they are entered

  Scenario: Use the previous button to access Table Properties
    When I select "Previous" from the Data Package Properties panel
    Then display a panel that allows me to enter Table properties for the last data tab
    And accept and validate column property values
  
