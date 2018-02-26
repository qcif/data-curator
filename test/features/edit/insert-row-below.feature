Feature: Insert Row Below
  As a Data Packager
  I want to insert another row below the current row
  So that I can add more data to the data tab
  The "Insert Row Below" command can be invoked using a menu item or keyboard shortcut

  @impl
  Scenario: Insert Row Below
    Given I have opened Data Curator
    And The table has 1 row by 3 columns
    And I click in row 1, column 1
    And I right-click
    Then I invoke the "Insert Row Below" command
    And The table should have 2 rows by 3 columns
    Then I should see a new row below the current row
    And I should see the cursor in the first column
