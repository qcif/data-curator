@backlog @not-needed

Feature: Open Multiple Applications
  As a User
  I want to open the application
  So that I can start working

  The application can be opened by:
  - launching it using a icon
  - opening a file and specifying to use the application

  The application can be opened more than once. This may be useful for users trying to compare two data packages

  If a data file is opened using the app, it is opened in the application window that has focus

  Scenario: open the application, app not already running
    Given I have not opened Data Curator
    When I open Data Curator
    Then the application is opened
    And an empty data tab is presented

  Scenario: open the application, app already running
    Given I have opened Data Curator
    When I open Data Curator again using the launch icon
    Then another instance of Data Curator is launched

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
    Then the specified file is opened in a new tab in the application instance that has focus
