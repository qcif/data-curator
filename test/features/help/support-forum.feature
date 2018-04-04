Feature: Support Forum
  As a User  
  I want to get support from the application community  
  So that I can discuss and learn about the application  

  RULES
  =====

  - "Support Forum" can be invoked from a menu item
  - Support will be launched in a separate browser window that will require access to the internet
  - The Support URL will be on https://ask.theodi.org.au/c/projects/data-curator

  Scenario: Support Forum
    Given Data Curator is open
    When "Support Forum" is invoked
    Then the Support URL should be opened in a separate browser window
