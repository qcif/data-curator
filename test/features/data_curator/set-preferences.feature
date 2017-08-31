@backlog

Feature: Preferences
  As a Data Packager
  I want to set default values and behaviours
  So that I can work efficiently and avoid re-keying values or repeating common actions

  Preferences that can be set include:

  - Application
    - "check for update" - check for an application update when the application starts (yes/no)
    - "file location" - default directory for opening and saving files (path)
    - "guess column properties on open" - when a file that isn't a data package is opened, perform the guess column properties command (yes/no)

  - Default Data Package properties
    - "license name" - pick from list of valid open licences or supply another. See http://opendefinition.org/licenses/ and http://specs.frictionlessdata.io/data-package/#licenses
    - "license path" - default from licence name, or supply another
    - "license title"  - default from licence name, or supply another
    - "homepage" - A URL for the home on the web that is related to this data package
    - Contributors - see http://specs.frictionlessdata.io/data-package/#contributors
      - "organization" -
      - "title" -
      - "email" -
      - "path" -
      - "role" - one of the standard values

  - Default Table properties
    - "Default save CSV dialect" - when saving a file (comma, tab, semi-colon, custom)
    - Custom CSV dialect
      - "delimiter" - specifies the character sequence which should separate fields (aka columns). Default = ","
      - "lineTerminator" - specifies the character sequence which should terminate rows. Default = "\r\n"
      - "quoteChar" - specifies a one-character string to use as the quoting character. Default = '"'
      - "doubleQuote" - controls the handling of quotes inside fields. If true, two consecutive quotes should be interpreted as one. Default = "true"
      - "escapeChar" - specifies a one-character string to use for escaping (for example, \), mutually exclusive with quoteChar. Not set by default
      - "nullSequence" - specifies the null sequence (for example \N). Not set by default
      - "skipInitialSpace" - specifies how to interpret whitespace which immediately follows a delimiter; if false, it means that whitespace immediately after a delimiter should be treated as part of the following field. Default = true
      - "header" - indicates whether the file includes a header row. If true the first row in the file is a header row, not data. Default = "true"
      - "caseSensitiveHeader" - indicates that case in the header is meaningful. For example, columns CAT and Cat should not be equated. Default = "false"
      - "csvddfVersion" - a number, in n.n format, e.g., 1.0. If not present, consumers should assume latest schema version.

  Scenario: Set Preferences
    Given I have opened Data Curator
    When I select "Set Preferences" from the menu
    Then display the preferances panel
    And accept and valid user input
    And save values after they are validated
