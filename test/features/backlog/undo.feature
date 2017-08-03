@backlog @sprint-1

Feature: Undo
  As a Data Packager
  I want to...
  So that I can...

  Not all commands can be undone.
  Only Edit commands can be undone.

  Unresolved - can typing values in cells be undone?

  Background:
    Given I have opened Data Curator
    And I have performed a command that can be undone

  Scenario: Use the menu to undo a command
    When I select "Undo" from the menu
    Then reverse the previous edit command

  Scenario: Use a keyboard shortcut to undo a command
    When I use the Undo keyboard shortcut
    Then reverse the previous edit command
