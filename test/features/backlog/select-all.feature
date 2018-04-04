@backlog @draft

Feature: Select all
  As a Data Packager
  I want to select all the cells in a data table
  So that I can quickly perform an edit command on them

  The 'selection colour' is hex e4ecf6

  Select All should only select data in cells, not other user interface elements

  The "Select All" command can be invoked using a menu item or keyboard shortcut

  Scenario: Select All data cells in a table
    Given Data Curator is open
    When I invoke the "Select all" command
    Then select every cell in the active data tab
    And highlight the selected cells in the 'selection colour'
