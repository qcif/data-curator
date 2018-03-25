Feature: Set Data Package Properties
  As a Data Packager
  I want to describe the data package properties
  So that Data Consumers can understand the data inside the package and how it can be used

  RULES
  =====

  - Despite 'name' being only recommended in the specification, it must be entered
  - The 'profile' must be set to 'tabular-data-package'.
  - All other properties should be defaulted were possible or read from Preferences/Settings (when implemented)
  - "Set Data Package Properties" command can be invoked by a menu item, toolbar, or shortcut

  Background:
    Given Data Curator is open
    And a data tab is open

  Scenario: Set Data Package Properties
    When "Set Data Package Properties" is invoked
    Then display a panel that allows properties to be entered
    And accept and validate property values
    And save the values as they are entered
