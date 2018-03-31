Feature: Find data
  As a User  
  I want to find data within the current column or across the current table  
  So that I can determine if the data exists and correct it if necessary  

  RULES
  =====

  - Users can choose to find across the table or within the current column
  - The default search constraint is find in table
  - When a search is performed and no values are found, inform the user
  - When "Find next" is invoked but no values are found on reaching the end of the column/table, inform the user
  - When "Find previous" is invoked but no values are found on reaching the start of the column/table, inform the user
  - "Find" can be invoked using a toolbar, menu item or keyboard shortcut
  - "Find next" and "Find previous" can be invoked using a using a menu item, button or keyboard shortcut

  Notes
  =====
  
  - https://docs.handsontable.com/0.34.4/demo-searching.html

  Scenario: Find 
    Given Data Curator is open
    When "Find" is invoked
    Then a prompt for a search value and search constraints should be displayed
    And a prompt for a replacement value should be displayed

  Scenario: Find next
    Given Data Curator is open
    And a search value and optionally search constraints have been entered
    When "Find Next" is invoked
    Then the cursor should be moved to next value after the current active cell that matches the search value and complies with the search constraints 
    And all values that match the search value and complies with the search constraints should be highlighted

  Scenario: Find previous
    Given Data Curator is open
    And a search value and optionally search constraints have been entered
    When "Find Previous" is invoked
    Then the cursor should be moved to previous value after the current active cell that matches the search value and complies with the search constraints 
    And all values that match the search value and complies with the search constraints should be highlighted
