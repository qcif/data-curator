Feature: Cut
  As a Data Packager
  I want to remove data from the table and copy it to the clipboard
  So that I can paste the data elsewhere within the application or into another application

  Select some or all data in a cell
  Select one or more cells (row, column or block)

  The "Cut" function can be invoked using a menu item or keyboard shortcut

  Scenario: Cut data
    Given I have opened Data Curator
    And I have selected some data
    When I invoke the  "Cut" function
    Then copy the selected data to the cliboard and then delete the data from the selection
