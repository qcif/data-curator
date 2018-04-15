Feature: Set Data Package Properties
  As a Data Packager  
  I want to describe the data package properties  
  So that Data Consumers can understand the data inside the package and how it can be used  

  RULES
  =====

  - Despite 'name' being only recommended in the specification, it must be entered
  - The 'profile' must be set to 'tabular-data-package'.
  - All other properties should be defaulted were possible or read from Preferences/Settings (when implemented)
  - "Set Data Package Properties" command can be invoked by a menu item, toolbar, or shortcut
  
  USER INTERFACE
  ==============

  ![Data package user interface](https://raw.githubusercontent.com/ODIQueensland/data-curator/develop/static/img/ui/data-package.png)

  Background:
    Given Data Curator is open
    And a data tab is open

  Scenario: Set Data Package Properties
    When "Set Data Package Properties" is invoked
    Then a panel that allows properties to be set should be displayed
    And property values should be accepted and validated 
    And the values should be saved as they are entered
