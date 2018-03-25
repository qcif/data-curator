Feature: Set Case Sensitive Header Row
  As a Data Packager
  I want character case be considered in determining the uniqueness of the header row
  So that I have increased flexibility in naming column headers

  RULES
  =====

  - "Case Sensitive Header Row" can be disabled and enabled by a checkbox menu item
  - By default "Case Sensitive Header Row" is disabled

  Scenario: Enable Case Sensitive Header Row
    Given Data Curator is open
    When "Case Sensitive Header Row" is enabled
    Then check the menu item
    And consider case in determining the uniqueness of the header row
    And set the 'caseSensitiveHeader' in the CSV Dialect to 'true'

  Scenario: Disable Case Sensitive Header Row
    Given Data Curator is open
    When "Case Sensitive Header Row" is disabled
    Then uncheck the menu item
    And don't consider case in determining the uniqueness of the header row
    And set the 'caseSensitiveHeader' in the CSV Dialect to 'false'
