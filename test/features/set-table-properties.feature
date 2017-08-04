Feature: Set table properties
  As a Data Packager
  I want to described the table
  So that it can be validated and Data Consumers can understand and use it

  Table properties are defined in:
  - http://specs.frictionlessdata.io/data-resource/
  - http://specs.frictionlessdata.io/tabular-data-resource/
  - http://specs.frictionlessdata.io/csv-dialect/

  The 'name' is required
  The 'profile' should be set to 'tabular-data-resource'
  Other properties should be defaulted were possible or read from Settings (when implemented)
  The Data Packager can enter: 'title', 'description', 'sources', 'licenses'

  Background:
    Given I have opened Data Curator
    And I have opened a data tab

  Scenario: Use the menu to access Table Properties for the current Tab
    When I select "Table Properties" from the menu
    Then display a panel that allows me to enter properties for the current Tab
    And accept and validate Table property values
    And save the values as they are entered

  Scenario: Use the toolbar access Table Properties for the current Tab
    When I select "Table Properties" from the toolbar
    Then display a panel that allows me to enter properties for the current Tab
    And accept and validate Table property values
    And save the values as they are entered
