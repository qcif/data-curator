@backlog

Feature: Open CSV with Drag and Drop
  As a User
  I want to open a CSV file by dragging it on to the Application
  So that can I quickly open it

  Unresolved:
  - Can the command be extended to work for other file types (xls, tsv)?
  - The separator used in the CSV cannot be determined from the filename
  - Should the default separated in preferences be used to determine what type of file can be dragged on to the Application?

  Provide instructions on the application background to indicate that a file can be dragged and dropped

  Scenario: Drag a CSV file on to the application
    Given I have opened Data Curator
    And I have selected a file with a .csv extension
    When I Drag and Drop the CSV file on to the application
    Then open the file a new data tab to the right of any other open data tabs
    And set the Tab name to the 'filename'
    And set the CSV Dialect in the Table Properties to "Comma Separated"
