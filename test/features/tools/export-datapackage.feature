@done

Feature: Export Data Package
  As a Data Packager
  I want to export the data and associated metadata in a data package
  So that Data Consumers can access usuable open data and associated metadata in a single file

  Specification:
  - The Data Package properties are defined at http://specs.frictionlessdata.io/data-package/
  - The application only works with Tabular Data Packages, defined at http://specs.frictionlessdata.io/tabular-data-package/

  Export data package creates a datapackage.zip file that includes:
  - readme.md (containing the provenance information)
  - datapackage.json (containing the data package, table (data resource), csv dialect and column (schema) properties)
  - a data directory (containing each data file in the appropriate separated value file format)

  Rules to enable export data package menu item:
  - Licence property is mandatory
  - Successful validation against Table Schema

  Defaults:
  - Default the file save location from the Preferences/Settings (when implemented)
  - Default the filename to datapackage name property

  Export Data Package can be invoked by a menu item or the toolbar

  Scenario: Use the menu to Export Data Package
    Given I have opened Data Curator
    And I have completed all the required column, table and data package properties
    When I invoke "Export Data Package"
    Then prompt for location and name to save the file
    And assemble the data, properties and provenance information into a data package file
    And save it to the location
    And default the filename
    And warn if an existing file will be overwritten
