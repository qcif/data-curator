Feature: Sort column
  As a Data Packager
  I want to sort a column in ascending, descending, or original order
  So that I can detect cells with similar but different values that may be errors

  The "Sort column" command can be invoked by clicking on the column header
  Clicking on the column header alternates between sort ascending, descending, or return to the original order

  Scenario: Sort column
    Given I have opened Data Curator
    And I have 1 data tab open
    And the cursor is on a column header
    When I invoke "Sort column"
    Then sort the rows in order based on the column values and the previous sort order
    And show a sort order indicator next to the column heading
