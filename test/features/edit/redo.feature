Feature: Redo
  As a Data Packager
  I want to reserve an undo table edit command I just performed
  So that I can continue editing as if I hadn't performed the undo command

  Rules:
    - Only actions performed in editing the data in the table can be undo
    - The "Redo" command can be invoked using a menu item or keyboard shortcut

  Scenario: Redo an Undo command
    Given I have performed an "Undo" command
    When I invoke the "Redo" command
    Then reserve the previous "Undo" command
