@backlog

Feature: Select all
  As a Data Packager
  I want to select all the cells in a data table
  So that I can quickly perform an edit command on them

  RULES
  =====

  - Select All should only select data in cells, not other user interface elements
  - The "Select All" command can be invoked using a menu item or keyboard shortcut
  
  USER INTERFACE
  ==============
  
  ![Data Curator Select All user interface](https://github.com/ODIQueensland/data-curator/raw/develop/static/img/ui/select-all.png)

  Scenario: Select All data cells in a table
    Given Data Curator is open
    And the cursor is in a data tab
    When "Select all" is invoked
    Then every cell in the active data tab should be selected
    And highlight the selected cells in the 'selection colour'
