Feature: Add Tab
  As a Data Curator User
  I want to add another data table 
  So that I can package related data tables together

  RULES
  =====
  - The "Add Tab" command can be invoked using a button
  
    USER INTERFACE
    ==============

    ![Add tab user interface](https://raw.githubusercontent.com/ODIQueensland/data-curator/develop/static/img/ui/add-tab.png)

  Scenario: Add Tab
    Given Data Curator is open
    When "Add Tab" is invoked
    Then a empty table should open in a separate tab
