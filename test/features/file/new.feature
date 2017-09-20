Feature: New
  As a Data Packager
  I want to open a new data tab
  So that I can enter new data

  The New command can be invoked by a menu item, keyboard shortcut, or the add tab button

  Rules (desirable but not mandatory for v1 release):
  - Tab names must be unique
  - Name a new tab, "untitled-" with a sequential number appended to the end to enable uniqueness

  Scenario: Open a new data tab
    Given I have opened Data Curator
    When I invoke the "New" command
    Then create an empty 1 row by 3 column data tab in a new tab
    And show it the right-most position
    And set a unique Tab name
    And place the cursor in row 1, column 1
