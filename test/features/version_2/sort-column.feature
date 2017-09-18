@backlog 

Feature: Sort column
  As a Data Packager
  I want to sort a column in ascending or descending order
  So that I can detect cells with similar but different values that may be errors

  Unresolved:
  - how is sort column invoked - from the menu, control in header row, context menu?
  - how is ascending / descending specified?

  The "Sort column ascending" command can be invoked by:
  - by a menu item
  - clicking on the column header if the CSV Dialect has Header Rows set to true

  The "Sort column decending" command can be invoked by:
  - by a menu item
  - clicking on the column header if the CSV Dialect has Header Rows set to true and "Sort column ascending" was previously invoked

  Scenario: Sort column ascending
    Given I have opened Data Curator
    And I have 1 data tab open
    And the cursor is in a column
    When I invoke the "Sort column ascending" command
    Then sort the rows in ascending order based on the column values

  Scenario: Sort column decending
    Given I have opened Data Curator
    And I have 1 data tab open
    And the cursor is in a column
    When I invoke the "Sort column ascending" command
    Then sort the rows in decending order based on the column values
