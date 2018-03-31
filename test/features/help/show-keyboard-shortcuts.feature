Feature: Show Keyboard Shortcuts
  As a User  
  I want to be reminded of the keyboard shortcuts  
  So that I can learn to use the application more efficiently

  RULES
  =====

  - "Keyboard Shortcuts" can be invoked from a menu item or keyboard shortcut
  - a list of Keyboard Shortcuts will be launched in a separate browser window 

  Scenario: Show Keyboard Shortcuts
    Given Data Curator is open
    When "Keyboard Shortcuts" is invoked
    Then a separate window listing all the keyboard shortcuts should be displayed
