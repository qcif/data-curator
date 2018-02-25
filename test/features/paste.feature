Feature: Paste
  As a Data Packager
  I want to copy the data from the clipboard
  So that I can quickly enter data from other data sources

  The "Paste" command can be invoked using a menu item or keyboard shortcut

  Scenario: Paste data from the clipboard
    Given I have opened Data Curator
    And data is held in the clipboard
    And the cursor in a data tab
    When I invoke the "Paste" command
    Then copy the data from the clipboard
    And paste it into the data tab starting from the current cursor location
    And add rows or columns as required
