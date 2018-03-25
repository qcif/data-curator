Feature: Sort column
  As a Data Packager
  I want to sort a column in ascending, descending, or original order
  So that I can detect cells with similar but different values that may be errors

  Rules
  =====

    - The "Sort column" command can be invoked by clicking on the column header
    - Clicking on the column header alternates the sort order between ascending, descending, or the original order

  Scenario: Sort column
    Given Data Curator is open
    And one data tab is open
    And the cursor is on a column header
    When "Sort column" is invoked
    Then sort the rows in order based on the column values and the previous sort order
    And do not include the header row (the first row) in the sort
    And show a sort order indicator next to the column heading
