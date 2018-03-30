Feature: Paste
  As a Data Packager  
  I want to copy the data from the clipboard  
  So that I can quickly enter data from other data sources  

  RULES
  =====

  - The "Paste" command can be invoked using a menu item or keyboard shortcut

  Scenario: Paste data from the clipboard
    Given data is held in the clipboard
    And the cursor is in a data table cell
    When "Paste" is invoked
    Then the data should be copied from the clipboard
    And the data should be pasted into the data table starting from the current cell
    And rows or columns should be added if the data in the clipboard doesn't fit in the current table
