Feature: New data
  In order to create new data
  As a Data Creator
  I want to open a blank data table so I can start to enter the data values

  Scenario: New data using Menu
    Given I have opened Data Curator
    When the New menu item is selected
    Then open a new data tab to the right of any other open data tabs
    And display a table with 3 columns and 2 rows with no values in any cell
    And place the cursor in column A, row 1

  Scenario: New data using Windows shortcut
    Given I have opened Data Curator
    And I am using the Windows operating system
    When the Control and O buttons are pressed at the same time
    Then open a new data tab to the right of any other open data tabs
    And display a table with 3 columns and 2 rows with no values in any cell
    And place the cursor in column A, row 1

  Scenario: New data using macOS shortcut
    Given I have opened Data Curator
    And I am using the macOS operating system
    When the Command and O buttons are pressed at the same time
    Then open a new data tab to the right of any other open data tabs
    And display a table with 3 columns and 2 rows with no values in any cell
    And place the cursor in column A, row 1

  Scenario: New data using Linux short
    Given I have opened Data Curator
    And I am using the Linux operating system
    When the Control and O buttons are pressed at the same time
    Then open a new data tab to the right of any other open data tabs
    And display a table with 3 columns and 2 rows with no values in any cell
    And place the cursor in column A, row 1
