Feature: Undo
  As a Data Packager
  I want to reverse the edit command(s) I just performed by mistake
  So that I can revert the data to a prior good state

  Rules:
    - Only Edit commands can be undone
    - Edit commands can be undone until the last non-edit command

  Unresolved:
    - Can typing values in cells be undone?

  Background:
    Given I have opened Data Curator
    And I have performed a command that can be undone

  Scenario: Use the menu to undo a command
    When I select "Undo" from the menu
    Then reverse the previous edit command

  Scenario: Use a keyboard shortcut to undo a command
    When I use the Undo keyboard shortcut
    Then reverse the previous edit command
