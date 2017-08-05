Feature: Set data package properties
  As a Data Packager
  I want to describe the data package properties
  So that Data Consumers can understand the data inside the package and how it can be used

  Specificiations:
  - The Data Package properties are defined at http://specs.frictionlessdata.io/data-package/
  - The application only works with Tabular Data Packages, defined at http://specs.frictionlessdata.io/tabular-data-package/

  Rules:
  - Despite 'name' being only recommended in the specification, it must be entered for each table.
  - The 'profile' must be set to 'tabular-data-package'.
  - All other properties should be defaulted were possible or read from Preferences (when implemented)
  - Remaining properties can entered by the Data Packager

  Unresolved:
  - as the specification will change over time and users may like to configure the application to extend the specification (e.g. add temporal extent), consider defining the properties to be collected in a configuration file the varies the properties collected.

  Background:
    Given I have opened Data Curator
    And I have opened a data tab

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

  Scenario: Use the export button to export the data package
    When I select "Export" from the Data Package Properties panel
    Then involve the export data package command
