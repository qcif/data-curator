Feature: Redo
  As a Data Packager
  I want to repeat the edit command I just performed
  So that I can make the same change quickly

  Rules:
  - Not all commands can be re-done
  - Only Edit commands can be re-done

  Background:
    Given I have opened Data Curator
    And I have performed a command that can be re-done

  Scenario: Use the menu to undo a command
    When I select "Redo" from the menu
    Then repeat the previous edit command

  Scenario: Use a keyboard shortcut to undo a command
    When I use the "Redo" keyboard shortcut
    Then repeat the previous edit command
