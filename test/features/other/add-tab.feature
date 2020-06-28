Feature: Add Tab
  As a Data Curator User
  I want to add another data table
  So that I can package related data tables together

  RULES
  =====
  - The "Add Tab" command can be invoked using a button

    USER INTERFACE
    ==============

    ![Add tab user interface](https://raw.githubusercontent.com/qcif/data-curator/develop/static/img/ui/add-tab.png)

  @impl
  Scenario: Add Tab
    Given Data Curator is open
    And the window has 1 tab
    When the "Add Tab" button is invoked
    Then the window should have 2 tabs
    And the new tab should have 1 table
    And the new table should have 1 row by 3 columns
    And the new table should be empty
