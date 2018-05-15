Feature: New
  As a Data Packager
  I want to add a data table
  So that I can add and edit related data

  RULES
  =====

  - Tab names must be unique
  - Name a new tab, "untitled" with a sequential number appended to the end to enable uniqueness
  - The "New" command can be invoked using a menu item or the add tab button

  @impl
  Scenario: Default
    When Data Curator is open
    Then 1 window should be displayed
    And the window should have 1 tab
    And the tab should have 1 table
    And the table should have 1 row by 3 columns
    And the table should be empty
    And the cursor should be in row 1, column 1

  @dev
  Scenario: Add Tab
    Given Data Curator is open
    # When the "File"->"New" menu is selected
    # Then the window should have 2 tabs
    # And the new tab should have 1 table
    # And the new table should have 1 row by 3 columns
    # And the new table should be empty
    # And the cursor should be in the new table
    # And the cursor should be in row 1, column 1
    # And the new tab should be in the right-most position
    # And set a unique Tab name
