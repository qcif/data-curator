Feature: Select all
  As a Data Packager
  I want to select all the cells in a data table
  So that I can quickly perform and edit function on them

  Cut and copy are the two most likely edit functions to be performed after select all.

  The selection colour is hex e4ecf6

  Unresolved:
  - if the user types or pastes a value or presses delete, what happens?
  - if the user selects delete row(s) or delete column(s) do we alow a 0x0 table?
  - what is the insert row/column behaviour?

  Background:
    Given I have opened Data Curator

  Scenario: Use the menu to undo a command
    When I select "Select all" from the menu
    Then select every cell in the active data tab
    And highlight the selected cells in the selection colour

  Scenario: Use a keyboard shortcut to undo a command
    When I use the Select all keyboard shortcut
    Then select every cell in the active data tab
    And highlight the selected cells in the selection colour
