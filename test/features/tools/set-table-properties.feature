Feature: Set Table Properties
  As a Data Packager
  I want to described the table
  So that it can be validated and Data Consumers can understand and use it

  Table properties are defined in:
  - http://specs.frictionlessdata.io/data-resource/
  - http://specs.frictionlessdata.io/tabular-data-resource/
  - http://specs.frictionlessdata.io/csv-dialect/
  - http://specs.frictionlessdata.io/table-schema/#other-properties

  The 'name':
  - is required and must be unique
  - is defaulted from the file name excluding the file extension, if the file has been opened or saved
  - when available, replaces the Data Tab Name

  Some properties can be defaulted and do not need to not displayed:
  - 'path'
  - 'profile' must be set to 'tabular-data-resource'
  - 'format' the standard file extension for this type of resource
  - 'mediatype' the mediatype/mimetype of the resource 'text/csv'
  - 'encoding' UTF-8.
  - 'CSV Dialect' based on the format of the opened/saved file

  These properties are optional:
  - 'title'
  - 'description'
  - 'sources'
  - 'licenses'

  The following Table Scema properties apply to the whole Table:
    - 'missingValues'
    - 'primaryKeys'
    - 'foreignKeys'

  The 'foreign key' relationships can be to columns in:
    - the same table
    - a table in the same data package
    - at table at a url (planned addition to the Frictionless Data specification)

  Table Properties can be invoked from the menu, toolbar or pressing the Next button on Column Properties for the last column

  Scenario: Use the menu to access Table Properties for the current Tab
    Given I have opened Data Curator
    And I have opened a data tab
    When I invoke the "Table Properties" command
    Then display a panel that allows me to enter properties for the current Tab
    And default, accept and validate Table property values
    And save the values as they are entered
    And assign the 'name' property to the Data Tab Name
