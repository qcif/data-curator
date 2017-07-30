@backlog @sprint-1

Feature: Redo
  As a Data Packager
  I want to...
  So that I can...

  Not all commands can be re-done.
  Only Edit commands can be re-done.

  Unresolved
  - can typing values in cells be re-done?

  Background:
    Given I have opened Data Curator
    And I have performed a command that can be undone

  Scenario: Use the menu to undo a command
    When I select "Redo" from the menu
    Then reverse the previous edit command

  Scenario: Use a keyboard shortcut to undo a command
    When I use the "Redo" keyboard shortcut
    Then reverse the previous edit command
