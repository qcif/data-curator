Feature: Set Preferences
  As a Data Packager  
  I want to set default values and behaviours  
  So that I can work efficiently and avoid re-keying values or repeating common actions  

  RULES
  =====

  - Preferences is called Settings on non-macOS platforms
  - Preferences can be invoked via a menu item or keyboard shortcut
  - Preferences that can be set include:
    - Default Publishing platform
      - CKAN (in the future add DataHub.io, Data.World, OctoPub)
      - Portal URL e.g. https/data.qld.gov.au
    - Default Data Package properties
      - One [`Licenses`](http://frictionlessdata.io/specs/data-package/#licenses):
        - `license name` - pick from list of valid open licences. See [Open Definition](http://opendefinition.org/licenses/) for a list of licenses
        - `license path` - default from licence name
        - `license title` - default from licence name
      - One or more [`Contributors`](http://frictionlessdata.io/specs/data-package/#contributors), allow multiple entries (e.g. Author and Maintainer for CKAN)
        - `organization`
        - `title` (mandatory if other values exist)
        - `email`
        - `path`
        - `role` - one of the standard values in a drop down list
        
  LATER
  =====
  
  - Default Publishing platform (doesn't make sense to add until Publish is implemented)
  
  Scenario: Set Preferences
    Given Data Curator is open
    When "Set Preferences" is invoked
    Then the preferences panel should be displayed
    And preference values should be accepted and validated 
    And values should be stored so they are reapplied next time Data Curator is opened

  Scenario: Use Preferences
    Given Data Curator is open
    And preference values have been set
    When "Set Data Package Properties" is invoked
    Then the preferences values should be displayed in the Properties Panel
    And the values should be able to be changed
