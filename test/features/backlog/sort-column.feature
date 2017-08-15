@backlog

Feature: Sort column
  As a Data Packager
  I want to sort a column in ascending or descending order
  So that I can detect cells with similar but different values that may be errors

  Unresolved:
  - how is sort column invoked - from the menu, control in header row, context menu?
  - how is ascending / descending specified?

  Scenario: Sort column
    Given I have opened Data Curator
    And I have 1 data tab open
    And the cursor is in a column
    When I select "Sort column"
    Then sort the rows in the specified order based on the column values
