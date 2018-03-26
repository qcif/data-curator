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
    Then copy the data from the clipboard
    And paste it into the data table starting from the current cell
    And add rows or columns if the data in the clipboard doesn't fit in the current table
