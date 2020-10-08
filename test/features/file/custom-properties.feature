Feature: Custom Properties
  As a User
  I want to create and use custom properties
  So that I can add custom property key-value pairs to my Package, Table and/or Column Properties

  RULES
  =====

  - Custom properties can be entered against any combination of column, table and/or package properties
  - Custom properties are metadata keys only, with no effect on table data or other property metadata.
  - Because custom properties are created in Data Curator's Preferences/Settings, any key names are persisted on Data Curator closing,
  making the keys (not the values) available on next run of Data Curator
  - When importing properties or data packages into Data Curator, any custom keys in the imported metadata must already exist in Data-Curator
  if those custom key-value pairs are to be imported correctly.
  - Custom properties which have a value entered against its key in the relevant Column, Table or Package Property, will be part of the exported metadata.

  Scenario: Add Custom Column Metadata
    Given Data Curator is open
    When I invoke "Preferences"
    And I click "Add custom" button
    And I enter "test1" at name label
    And I select "column" at the types label
    And I invoke "Column Properties"
    Then I should see "test1" label with an empty property value

  Scenario: Add an identical Custom Column and a Table Column Metadata key
    Given Data Curator is open
    And I invoke "Preferences"
    And I click "Add custom" button
    And I enter "test1" at name label
    And I select "column" at the types label
    And I select "table" at the types label
    When I invoke "Column Properties" or I invoke "Table Properties"
    Then I should see "test1" label with an empty property value

  Scenario: Add Custom Column Metadata value
    Given Data Curator is open
    And a Custom Column Property, "test1" exists
    And I invoke "Column" Properties
    When I enter "value1" against the "test1" label
    And I complete the checks in order to export a datapackage
    And I invoke "Export Package Properties"
    Then I should see a .json file with a resource schema field key named "test1" with the value: "value1"

  Scenario: Add Custom Table Metadata value
    Given Data Curator is open
    And a Custom Table Property, "test1" exists
    And I invoke "Table" Properties
    When I enter "value1" against the "test1" label
    And I complete the checks in order to export a datapackage
    And I invoke "Export Package Properties"
    Then I should see a .json file with a resource key named "test1" with the value: "value1"

  Scenario: Add Custom Package Metadata value
    Given Data Curator is open
    And a Custom Package Property, "test1" exists
    And I invoke "Package" Properties
    When I enter "value1" against the "test1" label
    And I complete the checks in order to export a datapackage
    And I invoke "Export Package Properties"
    Then I should see a .json file with a top-level key named "test1" with the value: "value1"

