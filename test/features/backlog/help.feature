@backlog  @draft

Feature: Help
  As a Data Curator User
  I want to display help information
  So that I can learn how to use the application

  RULES
  =====
  - The "Help" command can be invoked using a menu item or a keyboard shortcut
  - Not all operating systems have a keyboard shortcut for help. Windows has function-key F1 but macOS does not have an equivalent convention.

  QUESTIONS
  =========
  
  - Should Help:
    - be launched in a separate window that will require access to the internet?
    - be embedded within Data Curator so no Internet connect is required?
    - include a search function?

  NOTES
  =====
  
  - Initial draft at https://qcif.github.io/data-curator-help/

  Scenario: Show Help
    Given Data Curator is open
    When I invoke the "Help" command
    Then the Help index page should open in a separate window
