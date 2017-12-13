Feature: New
  As a Data Packager
  I want to add a data table
  So that I can add and edit related data

  The "New" command can be invoked using a menu item or the add tab button

  Rules:
  - Tab names must be unique
  - Name a new tab, "untitled" with a sequential number appended to the end to enable uniqueness

  Scenario: Add Tab
    Given I have opened Data Curator
    When I invoke the "New" command
    Then create an empty 1 row by 3 column data tab in a new tab
    And show it the right-most position
    And set a unique Tab name
    And place the cursor in row 1, column 1
