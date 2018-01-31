@backlog

Feature: Help
  As a Data Packager or Data Consumer
  I want to display help information
  So that I can learn how to use the application

  The "Help" command can be invoked using a menu item or a keyboard shortcut

  Not all operating systems have a keyboard shortcut for help. Windows has function-key 1 (F1) but macOS does not have an equivalent convention.

  Unresolved:
  - Should Help:
    - be launched in a separate window that will require access to the internet?
    - be embedded within Data Curator so no Internet connect is required?
    - include a search function?

  Initial draft at https://odiqueensland.github.io/data-curator-help/

  Scenario: Help
    Given I have opened Data Curator
    When I invoke the "Help" command
    Then open the Help index in a separate window
