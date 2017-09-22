@done

Feature: Set Data Package Properties
  As a Data Packager
  I want to describe the data package properties
  So that Data Consumers can understand the data inside the package and how it can be used

  Specifications:
  - The Data Package properties are defined at http://specs.frictionlessdata.io/data-package/
  - The application only works with Tabular Data Packages, defined at http://specs.frictionlessdata.io/tabular-data-package/

  Rules:
  - Despite 'name' being only recommended in the specification, it must be entered
  - The 'profile' must be set to 'tabular-data-package'.
  - All other properties should be defaulted were possible or read from Preferences/Settings (when implemented)

  Set Data Package Properties command can be invoked by a menu item or the toolbar

  Background:
    Given I have opened Data Curator
    And I have opened a data tab

  Scenario: Set Data Package Properties
    When I invoke the "Set Data Package Properties" command
    Then display a panel that allows me to enter properties
    And accept and validate property values
    And save the values as they are entered

  Scenario: Use the previous button to access Table Properties
    When I select "Previous" from the Data Package Properties panel
    Then display a panel that allows me to Set Table Properties for the last data tab

  Scenario: Use the next button to return to column properties for the first column
    When I select "Next" from the Data Package Properties panel
    Then display a panel that allows me to Set Column Properties for the first column
