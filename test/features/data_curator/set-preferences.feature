Feature: Set Preferences
  As a Data Packager
  I want to set default values and behaviours
  So that I can work efficiently and avoid re-keying values or repeating common actions

  Rules:
  - Preferences is called Settings on non-macOS platforms
  - Preferences can be invoked via a menu item or keyboard shortcut

  Preferences will influence commands such as:
  - open (shortcut adjusted to default CSV Dialect)
  - save (shortcut adjusted to default CSV Dialect)

  Unresolved:
  - allow check for update on launch?

  Don't support CSV Dialect until fully implemented across the application

  Preferences that can be set include:

  - Default Publishing platform
    - CKAN (in the future add DataHub.io, Data.World, OctoPub)
    - Portal URL e.g. https/data.qld.gov.au

  - Default Data Package properties
    - "license name" - pick from list of valid open licences ~~or supply another~~. See http://opendefinition.org/licenses/ and http://frictionlessdata.io/specs/data-package/#licenses
    - "license path" - default from licence name ~~, or supply another~~
    - "license title"  - default from licence name ~~, or supply another~~
    - Sources
      - "title" (mandatory if other values exist)
      - "path"
      - "email"
    - [Contributors](http://frictionlessdata.io/specs/data-package/#contributors) allow multiple entries (e.g. Author and Maintainer for CKAN)
      - "organization"
      - "title" (mandatory if other values exist)
      - "email"
      - "path"
      - "role" - one of the standard values in a drop down list

  Scenario: Set Preferences
    Given I have opened Data Curator
    When I invoke "Set Preferences"
    Then display the preferences panel
    And accept and validate user input for each setting
    And save values after they are validated
