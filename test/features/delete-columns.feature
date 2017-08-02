Feature: Delete Columns
  As a Data Packager
  I want to delete one or more columns
  So that I can only share the data that is appropriate to share

  One or more columns can be deleted

  One column can be deleted based on the location of the cursor in the table

  One or more columns can be deleted by selecting a number of columns

  If the first column is deleted, instead moving the cursor to the column before, move the cursor to the column after

  Background:
    Given I have opened Data Curator
    And I have identified the column(s) to be deleted

  Scenario: Use the menu to delete column(s)
    When I select "Delete Column(s)" from the menu
    Then delete the selected column(s)
    And move the cursor to the previous column above and remain in the same row

  Scenario: Use a keyboard shortcut to undo a command
    When I use "Delete Column(s)" keyboard shortcut
    Then delete the selected column(s)
    And move the cursor to the previous column above and remain in the same row
