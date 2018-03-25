@backlog

Feature: Open file with Drag and Drop
  As a User
  I want to drag a file onto the Application
  So that can I quickly open it

  Rules:
  - Valid file types are .csv, .tsv, .xls, .xlsx
  - .csv are assumed to be comma separated
  - as semi-colon separated files do not have a unique file extension, they are treated as comma separated
  - The CSV Dialect for .csv, .xls, .xlsx will be set to be comma separated
  - The CSV Dialect for .tsv will be set to be Tab separated
  - If the file type is .xls or .xlsx, prompt for a worksheet name
  - Perform the appropriate Open file/sheet feature based on the file type

Background:
  Given Data Curator is open
  And I have seen on the application background that a file can be dragged and dropped

  Scenario: Drag a comma separated value file type on to the application
    When I Drag and Drop a comma separated value file type on to the application
    Then 'Open Comma Separated file'

  Scenario: Drag a tab separated value file type on to the application
    When I Drag and Drop a tab separated value file type on to the application
    Then 'Open Tab Separated file'

  Scenario: Drag an Excel file type on to the application
    When I Drag and Drop a Excelfile type on to the application
    Then 'Open Excel sheet'

  Scenario: Drag a comma separated value file type on to the application
    When I Drag and Drop an invalid file type on to the application
    Then do nothing
