Feature: Move cursor in table
  As a Data Packager
  I want to move the cursor within the table
  So that I can edit data in a different cell

  Rules
  =====

    - Move commands can be invoked by a keyboard shortcut
    - If a movement causes the cursor to move off the screen but is still within the table, then scroll the table so the cursor remains visible on the screen
    - If the cursor is in the first or last, row or column and a move command would go beyond the edge of the table, do nothing

  Background:
  Given Data Curator is open
    And the cursor is in a cell

  Scenario: Move Up
    When "Move Up" is invoked
    Then move the cursor to the cell above
    And keep the cursor visible on the screen by scrolling

  Scenario: Move Down
    When "Move Down" is invoked
    Then move the cursor to the cell below
    And keep the cursor visible on the screen by scrolling

  Scenario: Move Left
    When "Move Left" is invoked
    Then move the cursor to the cell on the left
    And keep the cursor visible on the screen by scrolling

  Scenario: Move Right
    When "Move Right" is invoked
    Then move the cursor to the cell on the right
    And keep the cursor visible on the screen by scrolling
