Feature: Replace data
  As a Data Packager  
  I want to replace one or more values with another  
  So that I can correct data errors quickly  

  RULES
  =====

  - "Replace Next" can be invoked from a menu item, a keyboard shortcut, or button
  - "Replace Previous" can be invoked from a menu item, a keyboard shortcut, or button
  - "Replace All" can be invoked from a button
  
  USER INTERFACE
  ==============
  
  The user should be warned that the replace function cannot be undone
  
  ![Data Curator Find and Replace User Interface](https://github.com/ODIQueensland/data-curator/raw/develop/static/img/ui/find-and-replace.png)
  
  LATER
  =====
  
  - The replacement order is down columns and then across rows 


  Scenario: Replace Next in column
    Given Data Curator is open
    And a search and replacement value has been provided
    And the "in column" constraint is set
    When "Replace Next" is invoked
    Then the first value in the current column that matches the search value after the current cursor position should be replaced with the replacement value
    And the cursor should be moved to that cell

  Scenario: Replace Previous in column
    Given Data Curator is open
    And a search and replacement value has been provided
    And the "in column" constraint is set
    When "Replace Previous" is invoked
    Then the first value in the current column that matches the search value before the current cursor position should be replaced with the replacement value
    And the cursor should be moved to that cell

  Scenario: Replace All in column
    Given Data Curator is open
    And a search and replacement value has been provided
    And the "in column" constraint is set
    When "Replace All" is invoked
    Then all the values in the current column that match the search value should be replaced with the replacement value

  Scenario: Replace Next in table
    Given Data Curator is open
    And a search and replacement value has been provided
    And the "in table" constraint is set
    When "Replace Next" is invoked
    Then the first value in the table that matches the search value after the current cursor position should be replaced with the replacement value
    And the cursor should be moved to that cell
  
  Scenario: Replace Previous in table
    Given Data Curator is open
    And a search and replacement value has been provided
    And the "in table" constraint is set
    When "Replace Next" is invoked
    Then the first value in the table that matches the search value before the current cursor position should be replaced with the replacement value
    And the cursor should be moved to that cell

  Scenario: Replace All in table
    Given Data Curator is open
    And a search and replacement value has been provided
    And a replacement value has been provided
    And the "in table" constraint is set
    When "Replace All" is invoked
    Then all the values in the table that match the search value should be replaced with the replacement value
