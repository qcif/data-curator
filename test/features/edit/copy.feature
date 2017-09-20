Feature: Copy
  As a Data Packager
  I want to copy data to the clipboard
  So that I can paste the data elsewhere in the application or into another application

  Select some or all data in a cell
  Select one or more cells (row, column or block)

  The "Copy" command can be invoked using a menu item or keyboard shortcut

  Scenario: Copy data
    Given I have opened Data Curator
    And I have selected some data
    When I invoke the  "Copy" command
    Then copy the data to the "clipboard"
