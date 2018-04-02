Feature: Insert Row Below
  As a Data Packager  
  I want to insert another row below the current row  
  So that I can add more data to the data tab  

  RULES
  =====

  - The "Insert Row Below" command can be invoked using a menu item, keyboard shortcut or a context menu in the data tab
  
  @impl
  Scenario: Insert Row Below
    Given I have opened Data Curator
    And The table has 1 row by 3 columns
    When I click in row 1, column 1
    And I right-click
    Then I click on "Insert Row Below"
    And The table should have 2 rows by 3 columns
    And I should see 1 new row below the current row
    And I should see 3 columns
    And I should see the cursor in row 2, column 1
