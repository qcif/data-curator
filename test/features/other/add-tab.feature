Feature: Add Tab
  As a Data Packager
  I want to add a data table
  So that I can add and edit related data

  The "Add Tab" command can be invoked using the add tab button

  Rules (desirable but not mandatory for v1 release):
  - Tab names must be unique
  - Name a new tab, "untitled-" with a sequential number appended to the end to enable uniqueness

  Scenario: Add Tab
    Given I have opened Data Curator
    When I invoke the "Add Tab" command
    Then create an empty 2x3 data tab in a new tab
    And show it the right-most position
    And set a unique Tab name
