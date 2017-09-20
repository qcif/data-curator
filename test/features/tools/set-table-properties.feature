@done

Feature: Set Table Properties
  As a Data Packager
  I want to described the table
  So that it can be validated and Data Consumers can understand and use it

  Table properties are defined in:
  - http://specs.frictionlessdata.io/data-resource/
  - http://specs.frictionlessdata.io/tabular-data-resource/
  - http://specs.frictionlessdata.io/csv-dialect/

  The 'name' is required.
  The 'name' is defaulted from the CSV name, if the file has been opened or saved
  The 'name', when available, replaces the Data Tab Name

  The 'profile' should be set to 'tabular-data-resource'

  Other properties should be defaulted where possible or read from Preferences (when implemented)

  The Data Packager can enter: 'title', 'description', 'sources', 'licenses'

  The Data Packager can choose a CSV dialect (comma, tab, semi-colon separated, custom) for the table.
  The CSV Dialect is set on opening the file (move to open feature)

  Table Properties can be invoked from the menu or toolbar

  Scenario: Use the menu to access Table Properties for the current Tab
    Given I have opened Data Curator
    And I have opened a data tab
    When I invoke the "Table Properties" command
    Then display a panel that allows me to enter properties for the current Tab
    And accept and validate Table property values
    And save the values as they are entered
    And assign the 'name' property to the Data Tab Name
