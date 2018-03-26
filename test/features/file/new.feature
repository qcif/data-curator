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
    When I have opened Data Curator
    Then I should see 1 window opened
    And The window should have 1 tab opened
    And The tab should have 1 table
    And The table should have 1 row by 3 columns
    And The table should be empty
    And The cursor should be in row 1, column 1

  @latest
  @impl
  Scenario: Add Tab
    Given I have opened Data Curator
    When I click on the "File"->"New" menu
    Then create an empty 1 row by 3 column data tab in a new tab
    And show it the right-most position
    And set a unique Tab name
    And place the cursor in row 1, column 1
