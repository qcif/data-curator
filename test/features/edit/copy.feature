Feature: Copy
  As a Data Packager
  I want to copy data to the clipboard
  So that I can paste the data elsewhere in the application or into another application

  Select some or all data in a cell
  Select one or more cells (row, column or block)

  Background:
    Given I have opened Data Curator
    And I have selected some data

  Scenario: Use the menu to undo a command
    When I select "Copy" from the menu
    Then Copy the data to the "clipboard"

  Scenario: Use a keyboard shortcut to undo a command
    When I use the "Copy" keyboard shortcut
    Then  Copy the data to the "clipboard"
