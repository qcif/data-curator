Feature: Set Preferences using Configuration File
  As a Open Data leader in my organisation
  I want to deploy Data Curator with some preset default values
  So that my organisation is consistent in how it packages open data

  Application defaults
  - "check for update" - check for an application update when the application starts (yes/no)
  - "file location" - default directory for opening and saving files (path)
  - "guess column properties on open" - when a file that isn't a data package is opened, perform the guess column properties command (yes/no)

  Data Package properties
  - licenses (see http://opendefinition.org/licenses/ and http://specs.frictionlessdata.io/data-package/#licenses):
    - "license name" - pick from list of valid open licences or supply another.
    - "license path" - default from licence name, or supply another
    - "license title" - default from licence name, or supply another
  - "homepage" - A URL for the home on the web that is related to this data package
  - sources
    - "title"
    - "path"
    - "email"
  - contributors - see http://specs.frictionlessdata.io/data-package/#contributors
    - "title"
    - "path"
    - "email"
    - "role"
    - "organization"

Scenario: Open Data Curator with a Configuration file
  Given I have defined a Configuration file
  When I open Data Curator
  Then read the Configuration file
  And default application properties from the values in the file
