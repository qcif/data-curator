Feature: Cut
  As a Data Packager
  I want to remove data from the table and copy it to the clipboard
  So that I can paste the data elsewhere within the application or into another application

  Rules:
    - Selected data can be some or all of the data in a cell, or one or more cells (e.g. row(s), column(s) or block of cells)
    - The "Cut" command can be invoked using a menu item or keyboard shortcut

  Scenario: Cut data
    Given some data is selected
    When "Cut" is invoked
    Then copy the selected data to the cliboard
    And delete the selected data from the table
