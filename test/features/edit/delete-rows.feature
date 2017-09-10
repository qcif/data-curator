Feature: Delete Rows
  As a Data Packager
  I want to delete one or more rows
  So that I can only share the data that is appropriate to share

  One or more rows can be deleted

  One row can be deleted based on the location of the cursor in the table

  One or more rows can be deleted by selecting a number of rows

  If the first row is deleted, instead moving the cursor to the row above, move the cursor to the row below

  The "Delete Rows" command can be invoked using a menu item or keyboard shortcut

  Scenario: Delete Row(s)
    Given I have opened Data Curator
    And I have identified the row(s) to be deleted
    When I invoke the "Delete Row(s)" command
    Then delete the selected row(s)
    And move the cursor to the row above and remain in the same column
