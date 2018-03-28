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
      - Successful validation against Table Schema is also desirable
    - Set default values
    - "Export Data Package" can be invoked by a menu item or the toolbar

  Scenario: Use the menu to Export Data Package
    Given Data Curator is open
    And all the required column, table and data package properties have been completed
    When "Export Data Package" is invoked
    Then prompt for location and name to save the file
    And assemble the data, properties and provenance information into a data package file
    And save it to the location
    And default the filename
    And warn if an existing file will be overwritten
