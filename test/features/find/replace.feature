Feature: Replace data
  As a Data Packager
  I want to replace one or more values that have been found
  So that I correct data errors quickly

  Rules
  =====

    - "Replace" can be invoked from a menu item, a keyboard shortcut, or button
    - "Replace All" can be invoked from a button

  Scenario: Replace in column
    Given Data Curator is open
    And one or more values have been found using the "Find Next" or "Find Previous" command
    And a replacement value has been provided
    And the "in column" constraint is set
    When "Replace" is invoked
    Then replace the first value found in the column after the current cursor position with the replacement value

  Scenario: Replace All in column
    Given Data Curator is open
    And one or more values have been found using the "Find Next" or "Find Previous" command
    And a replacement value has been provided
    And the "in column" constraint is set
    When "Replace All" is invoked
    Then replace the all found values in the column with the replacement value

  Scenario: Replace in table
    Given Data Curator is open
    And one or more values have been found using the "Find Next" or "Find Previous" command
    And a replacement value has been provided
    And the "in table" constraint is set
    When "Replace" is invoked
    Then replace the first value found in the table after the current cursor position with the replacement value

  Scenario: Replace All in table
    Given Data Curator is open
    And one or more values have been found using the "Find Next" or "Find Previous" command
    And a replacement value has been provided
    And the "in table" constraint is set
    When "Replace All" is invoked
    Then replace the all found values in the table with the replacement value
