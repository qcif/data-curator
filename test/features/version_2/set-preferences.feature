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

  Preferences that can be set include:

  - Default Data Package properties
    - "license name" - pick from list of valid open licences or supply another. See http://opendefinition.org/licenses/ and http://specs.frictionlessdata.io/data-package/#licenses
    - "license path" - default from licence name, or supply another
    - "license title"  - default from licence name, or supply another
    - Sources
      - "title"
      - "path"
      - "email"
    - Contributors - see http://specs.frictionlessdata.io/data-package/#contributors
      - "organization" -
      - "title" -
      - "email" -
      - "path" -
      - "role" - one of the standard values

  - Default Table properties
    - "Default save CSV dialect" - when saving a file (comma(default), tab, semi-colon, custom)
    - If a Custom CSV dialect is supported, then set
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
    When I invoke "Set Preferences"
    Then display the preferences panel
    And accept and validate user input for each setting
    And save values after they are validated
