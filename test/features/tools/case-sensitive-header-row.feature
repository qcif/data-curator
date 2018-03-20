Feature: Set Case Sensitive Header Row
  As a Data Packager
  I want character case be considered in determining the uniqueness of the header row
  So that I have increased flexibility in naming column headers

  Case Sensitive Header Row can be invoked by a checkbox menu item
  By default the menu item is unchecked

  Scenario: Set Case Sensitive Header Row
    Given I have opened Data Curator
    When I invoke "Case Sensitive Header Row"
    Then check the menu item
    And consider case in determining the uniqueness of the header row
    And set the 'caseSensitiveHeader' in the CSV Dialect to 'true'

  Scenario: Unset Case Sensitive Header Row
    Given I have opened Data Curator
    When I disable "Case Sensitive Header Row"
    Then uncheck the menu item
    And don't consider case in determining the uniqueness of the header row
    And set the 'caseSensitiveHeader' in the CSV Dialect to 'false'
