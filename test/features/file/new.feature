Feature: New
  As a Data Packager
  I want to open a new data tab
  So that I can enter new data

  The New command can be invoked by a menu item, keyboard shortcut, or the add tab button

  Scenario: Open a new data tab
    Given I have opened Data Curator
    When I invoke the "New" command
    Then open a new data tab to the right of any other open data tabs
    And display a empty table with 3 columns and 2 rows
    And name the tab 'untitled'
    And place the cursor in first column and first row
