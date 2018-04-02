Feature: Show Keyboard Shortcuts
  As a User  
  I want to be reminded of the keyboard shortcuts  
  So that I can learn to use the application more efficiently

  RULES
  =====

  - "Keyboard Shortcuts" can be invoked from a menu item or keyboard shortcut
  
  USER INTERFACE
  ==============

  ![Show keyboard shortcuts user interface](https://raw.githubusercontent.com/ODIQueensland/data-curator/develop/static/img/ui/keyboard-shortcuts.png)

  Scenario: Show Keyboard Shortcuts
    Given Data Curator is open
    When "Keyboard Shortcuts" is invoked
    Then a separate window listing all the keyboard shortcuts should be displayed
