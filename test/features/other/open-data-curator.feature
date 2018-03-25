Feature: Open Data Curator
  As a User
  I want to open the application only once
  So that I can focus working on one data package at a time

  Rules:
    - The application can be opened by:
      - launching it using a icon
      - opening a file and specifying to use the application
    - The application can only be opened once
    - If the application is opened using the icon, an an empty 2x3 data tab is presented

  Scenario: Open the application using the icon, app not already running
    Given Data Curator is not open
    When Data Curator is opened using the launch icon
    Then the application is opened
    And an empty data tab is presented

  Scenario: Open the application using the icon, app already running
    Given Data Curator is open
    When I attempt to open Data Curator again using the launch icon
    Then focus is given to the running instance of Data Curator

  Scenario: Open the application via file open, app not already running
    Given Data Curator is not open
    And I select a data file using the File System
    When I specify to open the file using Data Curator
    Then the application is opened
    And the specified file is opened in a tab within the application

  Scenario: Open the application via file open, app already running
    Given Data Curator is open
    And I select a data file using the File System
    When I specify to open the file using Data Curator
    Then the specified file is opened in a new tab in the right-most position the running instance of Data Curator
