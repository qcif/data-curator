@backlog

Feature: Replace in column
  As a Data Packager
  I want to replace one or more values that have been found in a column
  So that I correct data errors quickly

  Scenario: Replace in column
    Given I have opened Data Curator
    And I have found one or more of the same value in a data tab
    When I select "Replace in column" from the menu
    And provide a replacement value
    Then replace the first value found in the column after the current cursor position with the replacement value

  Scenario: Replace All in column
    Given I have opened Data Curator
    And I have found one or more of the same values in a data tab
    When I select "Replace All in column" from the menu
    And provide a replacement value
    Then replace the all found values in the column with the replacement value
