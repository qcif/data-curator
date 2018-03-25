Feature: Redo
  As a Data Packager
  I want to reverse an undo table edit command I just performed
  So that I can continue editing as if I hadn't performed the undo command

  RULES
  =====

    - Only actions performed in editing the data in the table can be undo
    - The "Redo" command can be invoked using a menu item or keyboard shortcut

  Scenario: Redo an Undo command
    Given an "Undo" command has been performed
    When "Redo" is invoked
    Then reverse the previous "Undo" command
