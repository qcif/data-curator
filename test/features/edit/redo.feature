Feature: Redo
  As a Data Packager
  I want to repeat the edit command I just performed
  So that I can make the same change quickly

  The "Redo" command can be invoked using a menu item or keyboard shortcut

  Rules:
  - Only Edit commands can be re-done

  Scenario: Use the menu to redo a command
    Given I have opened Data Curator
    And I have performed a command that can be re-done
    When I invoke the "Redo" command
    Then repeat the previous edit command
