@backlog

Feature:  Show Next Tab
  As a Data Packager  
  I want to quickly move to the next data tab (to the right)  
  So that I can view related data  

  RULES
  =====

  - The "Show Next Tab" command can be invoked using a menu item or keyboard shortcut

  Scenario: Show the next tab
    Given Data Curator is open
    And more than one tab is open
    And the right-most tab is not selected
    When "Show Next Tab" is invoked
    Then the current tab should be deactivated
    And the tab to the right should be activated
  
  Scenario: Right-most tab selected
    Given Data Curator is open
    When the right-most tab is selected
    Then the "Show Next Tab" command should be unavailable

  Scenario: Right-most tab not selected
    Given Data Curator is open
    And more than one tab is open
    When the right-most tab is not selected
    Then the "Show Next Tab" command should be available

  Scenario: Only one tab open
    Given Data Curator is open
    And only one tab is open
    Then the "Show Next Tab" command should be unavailable
