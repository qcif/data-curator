Feature: Delete Columns
  As a Data Packager
  I want to delete one or more columns
  So that I can only share the data that is appropriate to share

  One or more columns can be deleted

  One column can be deleted based on the location of the cursor in the table

  One or more columns can be deleted by selecting a number of columns

  If the first column is deleted, instead moving the cursor to the column before, move the cursor to the column after

  The "Delete Column(s)" function can be invoked using a menu item or keyboard shortcut

  Scenario: Delete Column(s)
    Given I have opened Data Curator
    And I have identified the column(s) to be deleted
    When I invoke the "Delete Column(s)" function
    Then delete the selected column(s)
    And move the cursor to the previous column and remain in the same row
