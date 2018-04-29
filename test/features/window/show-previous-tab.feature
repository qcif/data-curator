@backlog

Feature:  Show Previous Tab
  As a Data Packager  
  I want to quickly move to the previous data tab (to the left)  
  So that I can view related data  

  RULES
  =====
  
  - The "Show Previous Tab" command can be invoked using a menu item or keyboard shortcut

  Scenario: Show the Previous tab
    Given Data Curator is open
    And more than one tab is open
    And the left-most tab is not selected
    When "Show Previous Tab" is invoked
    Then the current tab should be deactivated
    And the tab to the left should be activated
  
  Scenario: left-most tab selected
    Given Data Curator is open
    When the left-most tab is selected
    Then the "Show Previous Tab" command should be unavailable

  Scenario: left-most tab not selected
    Given Data Curator is open
    And more than one tab is open
    When the left-most tab is not selected
    Then the "Show Previous Tab" command should be available

  Scenario: Only one tab open
    Given Data Curator is open
    And only one tab is open
    Then the "Show Previous Tab" command should be unavailable
