Feature: Cut
  As a Data Packager
  I want to remove data from the table and copy it to the clipboard
  So that I can paste the data elsewhere within the application or into another application

  Select some or all data in a cell
  Select one or more cells (row, column or block)

  Background:
    Given I have opened Data Curator
    And I have performed a command that can be undone

  Scenario: Use the menu to undo a command
    When I select "Cut" from the menu
    Then copy the selected data to the cliboard and then delete the data from the cell(s)

  Scenario: Use a keyboard shortcut to undo a command
    When I use the "Cut" keyboard shortcut
    Then copy the selected data to the cliboard and then delete the data from the cell(s)
