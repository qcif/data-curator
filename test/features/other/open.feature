Feature: Open Application
  As a User
  I want to open the application
  So that I can start working

  The application can be opened by launching using a icon

  The application can be opened by opening a file and specifying to use the app.

  The application can only be opened once - It can not be presented as two separate windows.
  If the application is attemped to be opened a second time, focus is shifted to the existing application window.

  If a data file is opened using the app, it is opened in the existing window if that exists.

  Scenario: open the application, app not already running
    Given I have not opened Data Curator
    When I open Data Curator
    Then the application is opened
    And an empty data tab is presented

  Scenario: open the application, app already running
    Given I have opened Data Curator
    When I attempt to open Data Curator again
    Then focus is given to the Data Curator application already running

  Scenario: open the application via file open, app not already running
    Given I have not opened Data Curator
    And I select a data file using the File System
    When I specify to open the file using Data Curator
    Then the application is opened
    And the specified file is open in a tab within the application

  Scenario: open the application via file open, app already running
    Given I have opened Data Curator
    And I select a data file using the File System
    When I specify to open the file using Data Curator
    Then focus is given to the Data Curator application already running
    And the specified file is opened in a new tab within the application
