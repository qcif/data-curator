Feature: Export Data Package
  As a Data Packager  
  I want to export the data and associated metadata in a data package  
  So that Data Consumers can access usuable open data and associated metadata in a single file  

  RULES
  =====

  - Export data package creates a datapackage.zip file that includes:
    - readme.md (containing the provenance information)
    - datapackage.json (containing the data package, table (data resource), csv dialect and column (schema) properties)
    - a data directory (containing each data file in the appropriate separated value file format)
  - Mandatory column, table and package properties must be set to export data package
    - Mandatory metadata is defined in the [specification](http://frictionlessdata.io/specs)
    - Licence property is also mandatory
    - Provenance is also mandatory
  - Successful validation against Table Schema is also desirable but not required
  - Set default values for the data package
  - "Export Data Package" can be invoked by a menu item or the toolbar
  
  LATER
  =====

    - Data will be validated before it is exported

  Scenario: Export valid data in a Data Package
    Given Data Curator is open
    And the data is valid for the schema
    And all the required column, table and data package properties have been completed
    When "Export Data Package" is invoked
    Then "Validate" the data
    And a prompt for location and name to save the file should be displayed
    And the data, properties and provenance information should be saved into a datapackage.zip file

  Scenario: Export invalid data in a Data Package
    Given Data Curator is open
    And all the required column, table and data package properties have been completed
    When "Export Data Package" is invoked
    Then "Validate" the data
    And a warning that the data has validation errors should be displayed
    And a prompt for location and name to save the file should be displayed
    And the data, properties and provenance information should be saved into a datapackage.zip file
