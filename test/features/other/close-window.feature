Feature: Close Window
  As a Data Packager
  I want to close all data tabs and close the application but be warned if there are unsaved changes
  So that I can quickly and safely finish my work

  Close is invoked by a button on window containing the app
  The Close command can be cancelled

  Data Curator is a single window app so behaviour is similar to Quit however:
  - close on macOS keeps the application open
  - close in Windows/Linux quits the application

  Scenario: Close Window, all work saved
    Given I have opened Data Curator
    And I open 1 data tab
    And I save the data in the tab
    When I invoke "Close"
    Then close all tabs
    And based on the operating system, quit or close the application

  Scenario: Close Window, some work unsaved
    Given I have opened Data Curator
    And I open 1 data tab
    And I do not save the data in the tab
    When I invoke "Close"
    Then a prompt, warning about unsaved work is displayed
    And if the close command is not cancelled, close all tabs
    And based on the operating system, quit or close the application
